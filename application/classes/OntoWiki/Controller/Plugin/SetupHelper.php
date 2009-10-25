<?php

/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2008, {@link http://aksw.org AKSW}
 * @license   http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

/**
 * OntoWiki Setup Helper Zend plug-in.
 *
 * Sets up the component and module managers before any request is handled
 * but after the request object exists.
 *
 * @category OntoWiki
 * @package Controller_Plugin
 * @copyright Copyright (c) 2008, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 * @author Norman Heino <norman.heino@gmail.com>
 */
class OntoWiki_Controller_Plugin_SetupHelper extends Zend_Controller_Plugin_Abstract
{
    /**
     * Denotes whether the setup has been performed
     * @var boolean
     */
    protected $_isSetup = false;
    
    /**
     * RouteShutdown is the earliest event in the dispatch cycle, where a 
     * fully routed request object is available
     */
    public function routeShutdown(Zend_Controller_Request_Abstract $request)
    {
        // only once
        if (!$this->_isSetup) {
            $frontController = Zend_Controller_Front::getInstance();
            $ontoWiki        = OntoWiki::getInstance();
            $store           = $ontoWiki->erfurt->getStore();

            // instantiate model if parameter passed
            if (isset($request->m)) {
                try {
                    $model = $store->getModel($request->getParam('m', null, false));
                    $ontoWiki->selectedModel = $model;
                } catch (Erfurt_Store_Exception $e) {
                    // When no user is given (Anoymous) give the requesting party a chance to authenticate.
                    if (Erfurt_App::getInstance()->getAuth()->getIdentity()->isAnonymousUser()) {
                        // In this case we allow the requesting party to authorize...
                        $response = $frontController->getResponse();
                        
                        $response->setRawHeader('HTTP/1.1 401 Unauthorized');
                        $response->setHeader('WWW-Authenticate', 'FOAF+SSL');
                        $response->sendResponse();
                        exit;
                    }
                    
                    // post error message
                    $ontoWiki->prependMessage(new OntoWiki_Message(
                        '<p>Could not instantiate graph: ' . $e->getMessage() . '</p>' . 
                        '<a href="' . $ontoWiki->config->urlBase . '">Return to index page</a>', 
                        OntoWiki_Message::ERROR, array('escape' => false)));
                    // hard redirect since finishing the dispatch cycle will lead to errors
                    header('Location:' . $ontoWiki->config->urlBase . 'error/error');
                    exit;
                }
            }
            
            // instantiate resource if parameter passed
            if (isset($request->r)) {
                $graph = $ontoWiki->selectedModel;
                if ($graph instanceof Erfurt_Rdf_Model) {
                    $resource = new OntoWiki_Resource($request->getParam('r', null, true), $graph);
                    $ontoWiki->selectedResource = $resource;
                } else {
                    // post error message
                    $ontoWiki->prependMessage(new OntoWiki_Message(
                        '<p>Could not instantiate resource. No model selected.</p>' . 
                        '<a href="' . $ontoWiki->config->urlBase . '">Return to index page</a>', 
                        OntoWiki_Message::ERROR, array('escape' => false)));
                    // hard redirect since finishing the dispatch cycle will lead to errors
                    header('Location:' . $ontoWiki->config->urlBase . 'error/error');
                    exit;
                }
            }
            
            // trigger request ready event
            $event = new Erfurt_Event('onRequestRouted');
            $event->trigger();
            
            // avoid setting up twice
            $this->_isSetup = true;
        }
    }
}

