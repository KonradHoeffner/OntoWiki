/// <reference path="..\..\..\declaration\libraries\jquery.d.ts" />
/// <reference path="..\..\..\declaration\libraries\Underscore.d.ts" />

declare var cubeVizIndex:CubeViz_View_Application;

class View_DataselectionModule_Footer extends CubeViz_View_Abstract {
        
    constructor(attachedTo:string, app:CubeViz_View_Application) 
    {
        super("View_CubeVizModule_Footer", attachedTo, app);
        
        // publish event handlers to application:
        // if one of these events get triggered, the associated handler will
        // be executed to handle it
        this.bindGlobalEvents([
            {
                name:    "onAfterChange_selectedDSD",
                handler: this.onAfterChange_selectedDSD
            },
            {
                name:    "onBeforeClick_selectorItem",
                handler: this.onBeforeClick_selectorItem
            },
            {
                name:    "onChange_selectedDS",
                handler: this.onChange_selectedDS
            },
            {
                name:    "onStart_application",
                handler: this.onStart_application
            },
            {
                name:    "onUpdate_componentDimensions",
                handler: this.onUpdate_componentDimensions
            }
        ]);
    }
    
    /**
     *
     */
    public changePermaLinkButton() 
    {        
        // If no buttonVal is set, we see the Permalink button,
        // so transform it to see the link
        if(true == _.isUndefined(this.collection.get("buttonVal"))) {
            
            // remember old perma link button label, because of the language
            this.collection.add({
                "id": "buttonVal", 
                "value": $("#cubeviz-footer-permaLinkButton").html()
            });
            this.showLink();
            
        // We see the link, so transform it back to the Permalink button,
        // we saw before.
        } else {
            this.collection.remove("buttonVal");
            this.closeLink();
        }
    }
    
    /**
     *
     */
    public closeLink() 
    {
        $("#cubeviz-footer-permaLinkMenu").fadeOut("slow");
    }
    
    /**
     *
     */
    public initialize() 
    {
        // save link title
        this.collection.add({ 
            id: "cubeviz-footer-permaLink", 
            html: $("#cubeviz-footer-permaLink").html()
        });
        
        this.render();
    }
    
    /**
     *
     */
    public onAfterChange_selectedDSD() 
    {
        // Close permaLink button if it is still open
        if(false === _.isUndefined(this.collection.get("buttonVal"))){
            this.changePermaLinkButton();
        }
    }
    
    /**
     *
     */
    public onBeforeClick_selectorItem() 
    {
        if(true == _.isUndefined(this.collection.get("buttonVal"))) {}
        
        // We see the link, so transform it back to the Permalink button,
        // we saw before.
        else {
            var value:string = this.collection.get("buttonVal").value;
            this.collection.remove("buttonVal");
            this.closeLink();
        }
    }
    
    /**
     *
     */
    public onChange_selectedDS()
    {
        this.onAfterChange_selectedDSD();
    }
    
    /**
     *
     */
    public onClick_permaLinkButton(event) 
    {        
        // change perma link button
        this.changePermaLinkButton();
    }
    
    /**
     *
     */
    public onClick_showVisualization(event) 
    {
        var self = this;
        
        this.app._.backend.dataHash = CryptoJS.MD5(JSON.stringify(this.app._.data))+"";
        
        // if module + indexAction stuff was loaded
        if(true === cubeVizApp._.backend.uiParts.index.isLoaded) {
            
            // update link code        
            CubeViz_ConfigurationLink.saveData(
                this.app._.backend.url, this.app._.backend.serviceUrl, 
                this.app._.backend.modelUrl, this.app._.backend.dataHash, 
                this.app._.data, function(){
                    
                    // load new observations
                    DataCube_Observation.loadAll(
                        self.app._.backend.url, self.app._.backend.serviceUrl, 
                        self.app._.backend.modelUrl, self.app._.backend.dataHash, "",
                        function(newEntities){
                            
                            // save new observations
                            self.app._.data.retrievedObservations = newEntities;
                            
                            // trigger re-rendering of visualization
                            self.triggerGlobalEvent("onReRender_visualization");
                        }
                    );
                }
            );
            
        // if you are only in the module
        } else {
            
            this.app._.backend.dataHash = CryptoJS.MD5(JSON.stringify(this.app._.data))+"";
        
            CubeViz_ConfigurationLink.saveData(
                this.app._.backend.url, this.app._.backend.serviceUrl, 
                this.app._.backend.modelUrl, this.app._.backend.dataHash, 
                this.app._.data, function() {
            
                    self.app._.backend.uiHash = CryptoJS.MD5(JSON.stringify(self.app._.ui))+"";
            
                    CubeViz_ConfigurationLink.saveUI(
                        self.app._.backend.url, self.app._.backend.serviceUrl, 
                        self.app._.backend.modelUrl, self.app._.backend.uiHash, 
                        self.app._.ui, function() {
                        
                            // refresh page and show visualization for the latest linkCode
                            window.location.href = self.app._.backend.url
                                + "?m=" + encodeURIComponent (self.app._.backend.modelUrl)
                                + "&cv_dataHash=" + self.app._.backend.dataHash
                                + "&cv_uiHash=" + self.app._.backend.uiHash;
                        }
                    );
                }, 
                true
            );
        }
    }
    
    /**
     *
     */
    public onStart_application() 
    {
        this.initialize();
    }
    
    /**
     *
     */
    public onUpdate_componentDimensions() 
    {
        if(true == _.isUndefined(this.collection.get("buttonVal"))) {}
        
        // We see the link, so transform it back to the Permalink button,
        // we saw before.
        else {
            var value:string = this.collection.get("buttonVal").value;
            this.collection.remove("buttonVal");
            this.closeLink();
        }
    }
    
    /**
     *
     */
    public render() 
    {
        // Delegate events to new items of the template
        this.bindUserInterfaceEvents({
            "click #cubeviz-footer-permaLinkButton": this.onClick_permaLinkButton,
            "click #cubeviz-footer-showVisualizationButton": this.onClick_showVisualization
        });
        
        return this;
    }
    
    /**
     * build ahref + link including the permalink
     */
    public showLink() 
    {
        var self = this;
        
        this.app._.backend.dataHash = CryptoJS.MD5(JSON.stringify(this.app._.data))+"";
        
        CubeViz_ConfigurationLink.saveData(
            this.app._.backend.url, this.app._.backend.serviceUrl, 
            this.app._.backend.modelUrl, this.app._.backend.dataHash, 
            this.app._.data, function() {
        
                self.app._.backend.uiHash = CryptoJS.MD5(JSON.stringify(self.app._.ui))+"";
        
                CubeViz_ConfigurationLink.saveUI(
                    self.app._.backend.url, self.app._.backend.serviceUrl,
                    self.app._.backend.modelUrl, self.app._.backend.uiHash, 
                    self.app._.ui, function() {
                    
                        var link = self.app._.backend.url + "?";
                                   
                        // only set serviceUrl if it was set by server
                        if (false == _.str.isBlank(self.app._.backend.serviceUrl)) {
                            link += "serviceUrl=" + encodeURIComponent (self.app._.backend.serviceUrl) + "&";
                        }
                        
                        // add selected model url      
                        link += "m=" + encodeURIComponent (self.app._.backend.modelUrl)
                        
                        // add both hashes to the url
                              + "&cv_dataHash=" + self.app._.backend.dataHash
                              + "&cv_uiHash=" + self.app._.backend.uiHash;

                        // create url object
                        var url = $("<a></a>")
                            .attr ("href", link)
                            .attr ("target", "_self")
                            .html (self.collection.get("cubeviz-footer-permaLink").html);
                        
                        $("#cubeviz-footer-permaLink").html(url);
                            
                        // show menu
                        var positionLinkBtn = $("#cubeviz-footer-permaLinkButton").position();
                        
                        $("#cubeviz-footer-permaLinkMenu")
                            .css ("top", (positionLinkBtn.top + 30))
                            .css ("left", (positionLinkBtn.left))
                            .fadeIn("slow");
                    }
                );
            }, 
        true);
    }
}
