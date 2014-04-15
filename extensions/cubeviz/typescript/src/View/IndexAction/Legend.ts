/// <reference path="..\..\..\declaration\libraries\jquery.d.ts" />
/// <reference path="..\..\..\declaration\libraries\Underscore.d.ts" />

class View_IndexAction_Legend extends CubeViz_View_Abstract
{
    /**
     * 
     */
    constructor(attachedTo:string, app:CubeViz_View_Application) 
    {
        super("View_IndexAction_Legend", attachedTo, app);
        
        // publish event handlers to application:
        // if one of these events get triggered, the associated handler will
        // be executed to handle it
        this.bindGlobalEvents([
            {
                name:    "onUpdate_componentDimensions",
                handler: this.onUpdate_componentDimensions
            },
            {
                name:    "onStart_application",
                handler: this.onStart_application
            }
        ]);
    }
    
    /**
     *
     */
    public destroy() : CubeViz_View_Abstract
    {
        // remove event handler
        $("#cubeviz-legend-btnShowRetrievedObservations").off();
        
        // empty lists
        $("#cubeviz-legend-dataSet").html("");
        $("#cubeviz-legend-observations").html("");
        $("#cubeviz-legend-configurationList").html("");
        
        // Question mark dialog
        CubeViz_View_Helper.destroyDialog(
            $("#cubeviz-legend-componentDimensionInfoDialog")
        );
        
        super.destroy();
        return this;
    }
    
    /**
     * @param dataset any
     */
    public displayDataset(dataset:any, dataStructureDefinition:any) : void 
    {
        var self = this,
            tmp:any = null;
        
        // label
        $("#cubeviz-legend-dsLabel").html (
            "<a href=\"" + dataset.__cv_uri + "\" target=\"_blank\">" 
            + dataset.__cv_niceLabel + "</a>"
        );
        
        /**
         * rest of properties
         */
        $("#cubeviz-legend-dsProperties").html(
            "<tr class=\"info\">"
            + "<td><strong>Property</strong></td>"
            + "<td><strong>Value</strong></td>" +
            "</tr>"
        );
        
        // URI
        $("#cubeviz-legend-dsProperties").append(
            "<tr>"
            + "<td>URI</td>"
            + "<td style=\"word-break:break-all;\">" +
                "<a href=\"" + dataset.__cv_uri + "\" target=\"_blank\">" +
                    dataset.__cv_uri + 
                "</a></td>" +
            "</tr>"
        );
        
        _.each (dataset, function(value, property){
            
            // only show property with really uris (exclude __cv_* uri's)
            if (false === _.str.include(property, "__cv_")) {
                
                // relation to data structure definition
                if ("http://purl.org/linked-data/cube#structure" == property) {
                    
                    value = "<a href=\"" + dataStructureDefinition.__cv_uri + "\""
                               + " target=\"_blank\">" 
                               + dataStructureDefinition.__cv_niceLabel + "</a>";
                    
                // if value is list (object or array)
                } else if (true === _.isObject(value) || true === _.isArray(value)){
                    
                    var list = new CubeViz_Collection();
                    value = CubeViz_Visualization_Controller.linkify (
                        list.addList (value)._.join (", ")
                    );
                
                // simple property-value-pair    
                } else {
                    if (true === self.isValidUrl(value)) {
                        value = "<a href=\"" + value + "\" target=\"_blank\">"
                                    + _.str.prune (value, 60) +
                                "</a>";
                    }
                }
                
                // add pair to list
                $("#cubeviz-legend-dsProperties").append(
                    "<tr>"
                    + "<td>"
                        + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                    + "<td style=\"word-break:break-all;\">" + value + "</td>" +
                    "</tr>"
                );
            }
        });
        
        /**
         * if available, show source datasets
         */
        if (false === _.isNull(dataset.__cv_sourceDataset)
            && false === _.isUndefined(dataset.__cv_sourceDataset)) {
            
            // go through each source dataset
            _.each (dataset.__cv_sourceDataset, function(sourceDataset){
                
                // source dataset label
                $("#cubeviz-legend-dsProperties").append (
                    "<tr><td colspan=\"2\">" +
                        "<a name=\"" + (CryptoJS.MD5(sourceDataset.__cv_uri)+"").substring(0,6) + "\"></a>" + 
                    "</td></tr>" + 
                    
                    "<tr class=\"warning\">" + 
                        "<td colspan=\"2\">" + 
                            "<strong>Source Dataset: " + 
                            "<a href=\"" + sourceDataset.__cv_uri + "\" target=\"_blank\">" + 
                            sourceDataset.__cv_niceLabel + "</a></strong>" + 
                        "</td>" +
                    "</tr>"
                );
                
                // URI
                $("#cubeviz-legend-dsProperties").append(
                    "<tr>"
                    + "<td>URI</td>"
                    + "<td style=\"word-break:break-all;\">" + 
                        "<a href=\"" + sourceDataset.__cv_uri + "\" target=\"_blank\">" + 
                            sourceDataset.__cv_uri + "</a></td>" +
                    "</tr>"
                );
                
                // go through all properties of a source dataset
                _.each (sourceDataset, function(value, property){
                    
                    // only show property with really uris (exclude __cv_* uri's)
                    if (false === _.str.include(property, "__cv_")) {
                            
                        // if value is list (object or array)
                        if (true === _.isObject(value) || true === _.isArray(value)){
                            
                            var list = new CubeViz_Collection();
                            value = CubeViz_Visualization_Controller.linkify (
                                list.addList (value)._.join (", ")
                            );
                        
                        // simple property-value-pair    
                        } else {
                            if (true === self.isValidUrl(value)) {
                                value = "<a href=\"" + value + "\" target=\"_blank\">"
                                            + _.str.prune (value, 60) +
                                        "</a>";
                            }
                        }
                        
                        // add pair to list
                        $("#cubeviz-legend-dsProperties").append(
                            "<tr>"
                            + "<td>"
                                + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                            + "<td>" + value + "</td>" +
                            "</tr>"
                        );
                    }
                });
            });
        }
    }
    
    /**
     * @param dataStructureDefinition any
     */
    public displayDataStructureDefinition(dataStructureDefinition:any) : void
    {
        var self = this,
            tmp:any = null;
        
        // label
        $("#cubeviz-legend-dsdLabel").html (
            "<a href=\"" + dataStructureDefinition.__cv_uri + "\" target=\"_blank\">" 
            + dataStructureDefinition.__cv_niceLabel + "</a>"
        );
        
        // rest of properties
        $("#cubeviz-legend-dsdProperties").html(
            "<tr class=\"info\">"
            + "<td><strong>Property</strong></td>"
            + "<td><strong>Value</strong></td>" +
            "</tr>"
        );
        
        // URI
        $("#cubeviz-legend-dsdProperties").append(
            "<tr>"
            + "<td>URI</td>"
            + "<td style=\"word-break:break-all;\">" +
                "<a href=\"" + dataStructureDefinition.__cv_uri + "\" target=\"_blank\">" +
                    dataStructureDefinition.__cv_uri +
                "</a></td>" +
            "</tr>"
        );
        
        _.each (dataStructureDefinition, function(value, property){
            
            // only show values with really properties (exclude __cv_* uri's)
            if (false === _.str.include(property, "__cv_")) {
                
                // component relations
                if ("http://purl.org/linked-data/cube#component" == property) {
                    
                    var labels:string[] = [],
                        list:CubeViz_Collection = new CubeViz_Collection();
                    
                    // get list of value labels
                    list.addList(value)
                        .each(function(element){                            
                            // dimensions
                            _.each(self.app._.data.selectedComponents.dimensions, function(dimension){
                                if (element === dimension.__cv_uri) {
                                    labels.push(
                                        "<i class=\"icon-anchor\" style=\"font-size: 8px;\"></i> " +                                        
                                        "<a href=\"#" + (CryptoJS.MD5(dimension.__cv_uri) + "").substring (0, 6) + "\">" 
                                        + dimension.__cv_niceLabel + "</a> "
                                    );
                                }
                            });
                        });
                        
                    // measure
                    labels.push (
                        "<i class=\"icon-anchor\" style=\"font-size: 8px;\"></i> " +
                        "<a href=\"#" + (CryptoJS.MD5(self.app._.data.selectedComponents.measure.__cv_uri) + "").substring (0, 6) + "\">" 
                            + self.app._.data.selectedComponents.measure.__cv_niceLabel + "</a>"
                    );
                    
                    // attribute (optional)
                    if (false === _.isNull(self.app._.data.selectedComponents.attribute)
                        && false === _.isUndefined(self.app._.data.selectedComponents.attribute)) {
                        labels.push (
                            self.app._.data.selectedComponents.attribute.__cv_niceLabel
                        );
                    }
                        
                    // build label list
                    value = labels.join(", ");
                    
                // if value is list (object or array)
                } else if (true === _.isObject(value) || true === _.isArray(value)){
                    
                    var list = new CubeViz_Collection();
                    value = CubeViz_Visualization_Controller.linkify (
                        list.addList (value)._.join (", ")
                    );
                
                // simple property-value-pair    
                } else {
                    if (true === self.isValidUrl(value)) {
                        value = "<a href=\"" + value + "\" target=\"_blank\">"
                                    + _.str.prune (value, 60) +
                                "</a>";
                    }
                }
                
                // add pair to list
                $("#cubeviz-legend-dsdProperties").append(
                    "<tr>"
                    + "<td>"
                        + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                    + "<td style=\"word-break:break-all;\">" + value + "</td>" +
                    "</tr>"
                );
            }
        });
    }
    
    /**
     * observations any 
     * selectedDimensions any
     * selectedMeasure any
     */
    public displayRetrievedObservations(observations:any, selectedDimensions:any,
        selectedMeasure:any, selectedAttribute:any) : void
    {
        var html:string = "",
            i:number = 0,
            label:string = "",
            selectedAttributeUri:string = "",
            self = this;
            
        if (true === _.isNull(selectedAttribute) 
            || true === _.isUndefined(selectedAttribute)) {
            selectedAttributeUri = null;
        } else {
            selectedAttributeUri = selectedAttribute.__cv_uri;
        }
     
        // set title containing number of retrieved observations
        $("#cubeviz-legend-retrievedObservationsTitle").html (
            DataCube_Observation.getNumberOfActiveObservations(observations) + 
            " Retrieved Observations"
        );
        
        
        $("#cubeviz-legend-observations").html("");
        
        /**
         * set table header
         */
        html = "<tr>" + 
                    "<td></td>";
        
        _.each(selectedDimensions, function(dimension){
            // head entry
            html += "<td>"
                    + CubeViz_View_Helper.tplReplace(
                        $("#cubeviz-legend-tpl-observationsTableHeadEntry").html(), {
                            label:     dimension.__cv_niceLabel,
                            uriHash:   (CryptoJS.MD5(dimension.__cv_uri) + "").substring(0, 6)
                        }
                    ) 
                    + "</td>";
        });
        
        // title of selected measure
        html += "<td colspan=\"2\">" 
                + CubeViz_View_Helper.tplReplace(
                    $("#cubeviz-legend-tpl-observationsTableHeadEntry").html(), {
                        label:     selectedMeasure.__cv_niceLabel,
                        uriHash:   (CryptoJS.MD5(selectedMeasure.__cv_uri) + "").substring(0, 6)
                    }
                  )
                + "</td>";          
             
        // dummy cell
        html += "<td></td></tr>";
        
        // add generated HTML to DOM
        $("#cubeviz-legend-observations").append(html);
        
        // attach dimension objects to sortAsc and sortDesc buttons
        _.each(selectedDimensions, function(dimension){
            // sortAsc button
            $($("#cubeviz-legend-observations").find(".cubeviz-legend-sortAsc").get(i))
                .data ("dimension", dimension);
            
            // sortDesc button
            $($("#cubeviz-legend-observations").find(".cubeviz-legend-sortDesc").get(i++))
                .data ("dimension", dimension);
        });
        
        // attach measure object to value column
        $($("#cubeviz-legend-observations").find(".cubeviz-legend-sortAsc").get(i))
                .data ("measure", selectedMeasure);
        $($("#cubeviz-legend-observations").find(".cubeviz-legend-sortDesc").get(i))
                .data ("measure", selectedMeasure);
                
        
        /**
         * add line with additional information about the meta data
         */
        var observationValues = DataCube_Observation.getValues(
                observations, 
                selectedMeasure ["http://purl.org/linked-data/cube#measure"],
                true
            ),
            numberOfUsedDimensionElements:number = 0,
            
            // range of the values of observations
            rangeMin = "<strong>min:</strong> " + String(jsStats.min (observationValues[0])).substring(0, 10),
            rangeMax = "<strong>max:</strong> " + String(jsStats.max (observationValues[0])).substring(0, 10),
            value:string = null;
            
        html = "<tr class=\"info\">" +
                    "<td></td>";
        
        // go through all dimensions and show their label 
        _.each(selectedDimensions, function(dimension){ 
            
            // get the number of used dimension elements in retrieved observation
            numberOfUsedDimensionElements = _.size(DataCube_Observation.getUsedDimensionElementUris(
                observations,
                dimension["http://purl.org/linked-data/cube#dimension"]
            ));
                
            // html entry for this particular dimension
            if (numberOfUsedDimensionElements < _.size(dimension.__cv_elements)) {
                html += "<td><strong>" 
                        + _.size(dimension.__cv_elements) + "</strong> "
                        + "different dimension elements available, "
                        + "but only <strong>" + numberOfUsedDimensionElements + "</strong> are in use</td>"; 
            } else {
                html += "<td><strong>" 
                        + _.size(dimension.__cv_elements) + "</strong> "
                        + "different dimension elements are in use</td>";
            }
        });
        
        html +=   "<td>" + rangeMin + "</td>"
                + "<td>" + rangeMax + "</td>"
                + "<td></td>"
                "</tr>";
        
        $("#cubeviz-legend-observations").append(html);
        
        /**
         * go through all observations        
         */
         var i:number = 1;
        _.each(observations, function(observation){
            
            // if observatin is not active, ignore it
            if (false === DataCube_Observation.isActive(observation)) {
                return;
            }
            
            // check if the current observation has to be ignored:
            // it will ignored, 
            //      if attribute uri is set, but the observation
            //      has no value of it
            // and
            //      if the predicate which is labeled with DataCube's 
            //      attribute is not equal to the given selected attribute uri
            if ((false === _.isNull(selectedAttributeUri)
                && 
                (true === _.isNull(observation[selectedAttributeUri])
                 || true === _.isUndefined(observation[selectedAttributeUri])))
                && 
                selectedAttributeUri !== observation["http://purl.org/linked-data/cube#attribute"]) {
                // TODO implement a way to handle ignored observations
                return;
            }
            
            if (false === _.isNull(observation.__cv_sourceDataset)
                && false === _.isUndefined(observation.__cv_sourceDataset)) {
                html = "<tr>" +
                            "<td rowspan=\"2\"><strong>" + i++ + "</strong></td>";
            } else {
                html = "<tr>" +
                            "<td><strong>" + i++ + "</strong></td>";
            }
            
            _.each(selectedDimensions, function(dimension){
                
                // get label of dimension element used in observation
                _.each(dimension.__cv_elements, function(element){
                    if (element.__cv_uri == observation[dimension["http://purl.org/linked-data/cube#dimension"]]) {
                        label = element.__cv_niceLabel;
                    }
                });
                
                // add label of according dimension element
                html += "<td class=\"cubeviz-legend-dimensionElementLabelTd\">" 
                            + "<i class=\"icon-anchor\" style=\"font-size: 8px;\"></i>"
                            + " <a href=\"#" + (CryptoJS.MD5(dimension.__cv_uri) + "").substring(0, 6) + "\" "
                            +    "title=\"Anchor to dimension: " + dimension.__cv_niceLabel + "\">"
                            +   label
                            + "</a>";
                
                // if (
                
                html += "</td>";
            });        
            
            // if there is no source observation or only one 
            if (true === _.isUndefined(observation.__cv_sourceObservation)
                || 1 == _.size(observation.__cv_sourceObservation)) {
                    
                value = DataCube_Observation.parseValue(
                    observation, selectedMeasure["http://purl.org/linked-data/cube#measure"],
                    true
                );
                    
                // check for a temporary value
                if (true === _.isUndefined(observation.__cv_temporaryNewValue)) {               
                
                    // observation value
                    if (true === _.isNull(value)) {    
                        html += "<td class=\"cubeviz-legend-measureTd\" colspan=\"2\" style=\"background-color: #FFEAEA;\">" +
                                    "<em><small>no value found or type is not float</small></em>" +
                                "</td>";
                    } else {
                        html += "<td class=\"cubeviz-legend-measureTd\" colspan=\"2\">" +
                                    value +
                                "</td>";
                    }
                
                // in case there is a temporary value
                } else {
                    html += "<td class=\"cubeviz-legend-measureTd\" colspan=\"2\">" +
                                observation.__cv_temporaryNewValue 
                                + " &nbsp; <small>(Original: " + value + ")</small>" +
                            "</td>";
                }
                
            // there are two source observations
            } else if (2 == _.size(observation.__cv_sourceObservation)) {
                html += "<td class=\"cubeviz-legend-measureTd\" colspan=\"2\">" +
                            "<small><strong>No distinct value</strong>, because of two source observations!</small>" +
                        "</td>";
            } else {
                return;
            }
            
            // link to observation
            html += "<td>" 
                    + "<a href=\"" + observation.__cv_uri + "\" target=\"_blank\">Link</a>"
                    + "</td>";
            
            // happy ending
            html += "</tr>";
            
            if (false === _.isNull(observation.__cv_sourceDataset)
                && false === _.isUndefined(observation.__cv_sourceDataset)) {
                html += "<tr>" +
                            "<td colspan=\"" + (3 + _.size(selectedDimensions)) + "\" style=\"padding-top: 2px; padding-bottom: 10px;\">" +
                                "<small>Source Dataset: <strong>" +
                                    "<a href=\"#" + (CryptoJS.MD5(observation.__cv_sourceDataset.__cv_uri) + "").substring(0, 6) + "\">" + 
                                        observation.__cv_sourceDataset.__cv_niceLabel + 
                                    "</a>" +
                                "</strong></small><br/>" +
                                "<small>" +
                                    "<div class=\"cubeviz-clickable cubeviz-legend-sourceObservationOpener\">" + 
                                        "Show more information about source Observation " +
                                        "<i class=\"icon-chevron-down\"></i>" +
                                    "</div>" +
                                "</small><br/>" +
                                "<table class=\"cubeviz-legend-sourceObservation0 table table-bordered table-condensed table-striped responsive-utilities\"></table>" +
                                "<table class=\"cubeviz-legend-sourceObservation1 table table-bordered table-condensed table-striped responsive-utilities\"></table>" +
                            "</td>" +
                        "</tr>";
            }
            
            $("#cubeviz-legend-observations > tbody:last").append(html);
            
            /**
             * 
             */
            $($("#cubeviz-legend-observations").find(".cubeviz-legend-measureTd").last())
                .data ("observation", observation);
            
            
            /**
             * if available, show source observation
             */
            if (false === _.isNull(observation.__cv_sourceObservation)
                && false === _.isUndefined(observation.__cv_sourceObservation)) {
                
                if (1 == _.size(observation.__cv_sourceObservation)
                    && false === _.isNull(observation.__cv_sourceObservation[0])) {
                
                    $($("#cubeviz-legend-observations").find(".cubeviz-legend-sourceObservation1").last()).remove();
                
                    var $table = $($("#cubeviz-legend-observations").find(".cubeviz-legend-sourceObservation0").last());
                    
                    // URI
                    $table.append(
                        "<tr>"
                        + "<td>URI</td>"
                        + "<td style=\"word-break:break-all;\">" + 
                            "<a href=\"" + observation.__cv_sourceObservation[0].__cv_uri + "\" target=\"_blank\">" +
                                observation.__cv_sourceObservation[0].__cv_uri + "</a></td>" +
                        "</tr>"
                    );
                    
                    // go through all properties of a observation
                    _.each (observation.__cv_sourceObservation[0], function(value, property){
                        
                        // only show property with really uris (exclude __cv_* uri's)
                        if (false === _.str.include(property, "__cv_")) {
                                
                            // if value is list (object or array)
                            if (true === _.isObject(value) || true === _.isArray(value)){
                                
                                var list = new CubeViz_Collection();
                                value = CubeViz_Visualization_Controller.linkify (
                                    list.addList (value)._.join (", ")
                                );
                            
                            // simple property-value-pair    
                            } else {
                                if (true === self.isValidUrl(value)) {
                                    value = "<a href=\"" + value + "\" target=\"_blank\">"
                                                + _.str.prune (value, 60) +
                                            "</a>";
                                }
                            }
                            
                            // add pair to list
                            $table.append(
                                "<tr>"
                                + "<td>"
                                    + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                                + "<td style=\"word-break:break-all;\">" + value + "</td>" +
                                "</tr>"
                            );
                        }
                    });
                    
                    $table.hide();
                    
                    // setup opener for information about source observation
                    $($("#cubeviz-legend-observations").find(".cubeviz-legend-sourceObservationOpener").last())
                        .click (function(){
                            $table.fadeToggle(200);
                        });
                
                // no source observation
                } else if (true === _.isNull(observation.__cv_sourceObservation[0])) {
                    
                    
                // more than one source observation
                } else {
                    
                    // update notification text
                    $($("#cubeviz-legend-observations").find(".cubeviz-legend-sourceObservationOpener").last())
                        .html ("Show more information about <strong>both</strong> source Observations " +
                               "<i class=\"icon-chevron-down\"></i>");
                    
                    // build a table for both source observations
                    _.each([0, 1], function(position){
                    
                        var $table = $($("#cubeviz-legend-observations").find(".cubeviz-legend-sourceObservation" + position).last());
                        
                        // URI
                        $table.append(
                            "<tr>"
                            + "<td>URI</td>"
                            + "<td style=\"word-break:break-all;\">" + 
                                "<a href=\"" + observation.__cv_sourceObservation[position].__cv_uri + "\" target=\"_blank\">" +
                                    observation.__cv_sourceObservation[position].__cv_uri + "</a></td>" +
                            "</tr>"
                        );
                        
                        // go through all properties of a source observation
                        _.each (observation.__cv_sourceObservation[position], function(value, property){
                            
                            // only show property with really uris (exclude __cv_* uri's)
                            if (false === _.str.include(property, "__cv_")) {
                                    
                                // if value is list (object or array)
                                if (true === _.isObject(value) || true === _.isArray(value)){
                                    
                                    var list = new CubeViz_Collection();
                                    value = CubeViz_Visualization_Controller.linkify (
                                        list.addList (value)._.join (", ")
                                    );
                                
                                // simple property-value-pair    
                                } else {
                                    if (true === self.isValidUrl(value)) {
                                        value = "<a href=\"" + value + "\" target=\"_blank\">"
                                                    + _.str.prune (value, 60) +
                                                "</a>";
                                    }
                                }
                                
                                // add pair to list
                                $table.append(
                                    "<tr>"
                                    + "<td>"
                                        + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                                    + "<td style=\"word-break:break-all;\">" + value + "</td>" +
                                    "</tr>"
                                );
                            }
                        });
                        
                        $table.hide();
                        
                        // setup opener for information about source observation
                        $($("#cubeviz-legend-observations").find(".cubeviz-legend-sourceObservationOpener").last())
                            .click (function(){
                                $table.fadeToggle(200);
                            });
                    });                    
                }
            }
        });
        
        // re-bind event handler
        this.bindUserInterfaceEvents({
            "dblclick .cubeviz-legend-measureTd":   this.onDblClick_measureTd,
            "click .cubeviz-legend-sortAsc":        this.onClick_sortAsc,
            "click .cubeviz-legend-sortDesc":       this.onClick_sortDesc
        })
    }
        
    /**
     * @param selectedComponentDimensions any
     */
    public displaySelectedDimensions(selectedComponentDimensions:any) : void
    {
        var elementList:CubeViz_Collection = new CubeViz_Collection(),
            self = this,
            tmpList:CubeViz_Collection = new CubeViz_Collection(),
            $table:any = null;
        
        $("#cubeviz-legend-componentDimensions").html("");
        
        // go through each dimension
        _.each(selectedComponentDimensions, function(dimension){
            
            // setup tpl
            $("#cubeviz-legend-componentDimensions").append($(CubeViz_View_Helper.tplReplace(
                $("#cubeviz-legend-tpl-dimensionBlock").html(),
                { 
                    dimensionLabel: dimension.__cv_niceLabel,
                    dimensionUri: dimension.__cv_uri,
                    dimensionUriHash: (CryptoJS.MD5(dimension.__cv_uri)+"").substring (0, 6)
                }
            )));
            
            $table = $($("#cubeviz-legend-componentDimensions").find(".table").last());
            
            // table header
            $table.append(
                "<tr class=\"info\">"
                + "<td><strong>Property</strong></td>"
                + "<td><strong>Value</strong></td>" +
                "</tr>"
            );
            
            $table.append(
                "<tr>"
                + "<td>URI</td>"
                + "<td style=\"word-break:break-all;\">" +
                    "<a href=\"" + dimension.__cv_uri + "\" target=\"_blank\">" +
                        dimension.__cv_uri +
                    "</a></td>" +
                "</tr>"
            );
            
            // go through all properties
            _.each (dimension, function(value, property){
                                
                // only show property with really uris (exclude __cv_* uri's)
                if (false === _.str.include(property, "__cv_")) {
                
                    // if value is list (object or array)
                    if (true === _.isObject(value) || true === _.isArray(value)){
                        
                        var list = new CubeViz_Collection();
                        value = CubeViz_Visualization_Controller.linkify (
                            list.addList (value)._.join (", ")
                        );
                    
                    // simple property-value-pair    
                    } else {
                        if (true == self.isValidUrl(value)) {
                            value = "<a href=\"" + value + "\" target=\"_blank\">"
                                        + _.str.prune (value, 60) +
                                    "</a>";
                        }
                    }
                
                    $table.append(
                        "<tr>"
                        + "<td><a href=\"" + property + "\">" + property + "</a></td>"
                        + "<td>" + value + "</td>" +
                        "</tr>"
                    );
                }
            });
            
            /**
             * add dimension elements
             */
            tmpList.reset();
            
            elementList
                .reset()
                // add all dimension elements to a list
                .addList(dimension.__cv_elements)
                
                // add each element to another list, but before attach some html
                .each(function(element){$table.append(tmpList.add(
                    "<a href=\""+ element.__cv_uri  +"\" target=\"_blank\">" +
                        element.__cv_niceLabel + "</a>",
                null, true));});
                
            // add HTML of the other list
            $table.append(
                "<tr><td colspan=\"2\">" +
                    "<strong><em>" + tmpList.size() + " Dimension Elements</em></strong>" + 
                    "</td>" + 
                "</tr><tr>"
                    + "<td colspan=\"2\">" + tmpList._.join (", ") + "</td>" + 
                "</tr>"
            );
            
            /**
             * if available, show source component specification
             */
            if (false === _.isNull(dimension.__cv_sourceComponentSpecification)
                && false === _.isUndefined(dimension.__cv_sourceComponentSpecification)) {
                
                // go through each source component specification
                _.each (dimension.__cv_sourceComponentSpecification, function(sourceCS){
                    
                    // source component specification label
                    $table.append (
                        "<tr><td colspan=\"2\"></td></tr>" + 
                        
                        "<tr class=\"warning\">" + 
                            "<td colspan=\"2\">" + 
                                "<strong>Source Component Specification: " + 
                                "<a href=\"" + sourceCS.__cv_uri + "\" target=\"_blank\">" + 
                                sourceCS.__cv_niceLabel + "</a></strong>" + 
                            "</td>" +
                        "</tr>"
                    );

                    // URI
                    $table.append(
                        "<tr>"
                        + "<td>URI</td>"
                        + "<td style=\"word-break:break-all;\">" +
                            "<a href=\"" + sourceCS.__cv_uri + "\" target=\"_blank\">" +
                            sourceCS.__cv_uri +
                            "</a></td>" +
                        "</tr>"
                    );
                    
                    // go through all properties of a source component specification
                    _.each (sourceCS, function(value, property){
                        
                        // only show property with really uris (exclude __cv_* uri's)
                        if (false === _.str.include(property, "__cv_")) {
                                
                            // if value is list (object or array)
                            if (true === _.isObject(value) || true === _.isArray(value)){
                                
                                var list = new CubeViz_Collection();
                                value = CubeViz_Visualization_Controller.linkify (
                                    list.addList (value)._.join (", ")
                                );
                            
                            // simple property-value-pair    
                            } else {
                                if (true === self.isValidUrl(value)) {
                                    value = "<a href=\"" + value + "\" target=\"_blank\">"
                                                + _.str.prune (value, 60) +
                                            "</a>";
                                }
                            }
                            
                            // add pair to list
                            $table.append(
                                "<tr>"
                                + "<td>"
                                    + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                                + "<td style=\"word-break:break-all;\">" + value + "</td>" +
                                "</tr>"
                            );
                        }
                    });                    
                    
                    /**
                     * add dimension elements
                     */
                    tmpList.reset();
                    
                    elementList
                        .reset()
                        // add all dimension elements to a list
                        .addList(sourceCS.__cv_elements)
                        
                        // add each element to another list, but before attach some html
                        .each(function(element){$table.append(tmpList.add(
                            "<a href=\""+ element.__cv_uri  +"\" target=\"_blank\">" +
                                element.__cv_niceLabel + "</a>",
                        null, true));});
                        
                    // add HTML of the other list
                    $table.append(
                        "<tr><td colspan=\"2\">" +
                            "<em>" + tmpList.size() + " Dimension Elements</em>" + 
                            "</td>" + 
                        "</tr><tr>"
                            + "<td colspan=\"2\">" + tmpList._.join (", ") + "</td>" + 
                        "</tr>"
                    );
                });
            }
        });
    }
        
    /**
     * @param selectedMeasure any
     * @param selectedAttribute any
     */
    public displaySelectedMeasureAndAttribute(selectedMeasure:any, selectedAttribute:any) : void
    {     
        var self = this,
            $table = $("#cubeviz-legend-componentMeasureProperties");
           
        /**
         * display measure
         */
        $("#cubeviz-legend-componentMeasureLabel").html(
            "<a name=\"" + (CryptoJS.MD5(selectedMeasure.__cv_uri)+"").substring (0, 6) + "\">" +
                "<a href=\"" + selectedMeasure.__cv_uri + "\">" 
                + selectedMeasure.__cv_niceLabel + "</a>" +
            "</a>"
        );
        
        // table header
        $table.append(
            "<tr class=\"info\">"
            + "<td><strong>Property</strong></td>"
            + "<td><strong>Value</strong></td>" +
            "</tr>"
        );
    
        // go through all properties
        _.each (selectedMeasure, function(value, property){
        
            // only show property with really uris (exclude __cv_* uri's)
            if (false === _.str.include(property, "__cv_")) {
                
                // if value is list (object or array)
                if (true === _.isObject(value) || true === _.isArray(value)){
                    
                    var list = new CubeViz_Collection();
                    value = CubeViz_Visualization_Controller.linkify (
                        list.addList (value)._.join (", ")
                    );
                
                // simple property-value-pair    
                } else {
                    if (true == self.isValidUrl(value)) {
                        value = "<a href=\"" + value + "\" target=\"_blank\">"
                                    + _.str.prune (value, 60) +
                                "</a>";
                    }
                }
            
                $table.append(
                    "<tr>"
                    + "<td><a href=\"" + property + "\">" + property + "</a></td>"
                    + "<td>" + value + "</td>" +
                    "</tr>"
                );              
            }
        });
        
        /**
         * if available, show source measures
         */
        if (false === _.isNull(selectedMeasure.__cv_sourceComponentSpecification)
            && false === _.isUndefined(selectedMeasure.__cv_sourceComponentSpecification)) {
            
            // go through each source component specification
            _.each (selectedMeasure.__cv_sourceComponentSpecification, function(sourceMeasure){
                
                // source component specification label
                $table.append (
                    "<tr><td colspan=\"2\"></td></tr>" + 
                    
                    "<tr class=\"warning\">" + 
                        "<td colspan=\"2\">" + 
                            "<strong>Source Measure: " + 
                            "<a href=\"" + sourceMeasure.__cv_uri + "\" target=\"_blank\">" + 
                                sourceMeasure.__cv_niceLabel + "</a></strong>" + 
                        "</td>" +
                    "</tr>"
                );

                // URI
                $table.append(
                    "<tr>"
                    + "<td>URI</td>"
                    + "<td style=\"word-break:break-all;\">" +
                        "<a href=\"" + sourceMeasure.__cv_uri + "\" target=\"_blank\">" +
                        sourceMeasure.__cv_uri +
                        "</a></td>" +
                    "</tr>"
                );
                
                // go through all properties of a source component specification
                _.each (sourceMeasure, function(value, property){
                    
                    // only show property with really uris (exclude __cv_* uri's)
                    if (false === _.str.include(property, "__cv_")) {
                            
                        // if value is list (object or array)
                        if (true === _.isObject(value) || true === _.isArray(value)){
                            
                            var list = new CubeViz_Collection();
                            value = CubeViz_Visualization_Controller.linkify (
                                list.addList (value)._.join (", ")
                            );
                        
                        // simple property-value-pair    
                        } else {
                            if (true === self.isValidUrl(value)) {
                                value = "<a href=\"" + value + "\" target=\"_blank\">"
                                            + _.str.prune (value, 60) +
                                        "</a>";
                            }
                        }
                        
                        // add pair to list
                        $table.append(
                            "<tr>"
                            + "<td>"
                                + "<a href=\"" + property + "\" target=\"_blank\">" + property + "</a></td>"
                            + "<td style=\"word-break:break-all;\">" + value + "</td>" +
                            "</tr>"
                        );
                    }
                });
            });
        }
        
        
        /**
         * display attribute (if available)
         */
        // if attribute is not available
        if (true === _.isNull(selectedAttribute) 
            || true === _.isUndefined(selectedAttribute)) {
            $("#cubeviz-legend-componentAttribute").hide();
        
        // attribute is available
        } else {
            $("#cubeviz-legend-componentAttributeLabel").html(
                "<a href=\"" + selectedMeasure.__cv_uri + "\">" 
                + selectedAttribute.__cv_niceLabel + "</a>"
            );
            
            // table header
            $("#cubeviz-legend-componentAttributeProperties")
                .append(
                    "<tr class=\"info\">"
                    + "<td><strong>Property</strong></td>"
                    + "<td><strong>Value</strong></td>" +
                    "</tr>"
                );
            
            // go through all properties
            _.each (selectedAttribute, function(value, property){
            
                // only show property with really uris (exclude __cv_* uri's)
                if (false === _.str.include(property, "__cv_")) {
                    
                    // if value is list (object or array)
                    if (true === _.isObject(value) || true === _.isArray(value)){
                        
                        var list = new CubeViz_Collection();
                        value = CubeViz_Visualization_Controller.linkify (
                            list.addList (value)._.join (", ")
                        );
                    
                    // simple property-value-pair    
                    } else {
                        if (true == self.isValidUrl(value)) {
                            value = "<a href=\"" + value + "\" target=\"_blank\">"
                                        + _.str.prune (value, 60) +
                                    "</a>";
                        }
                    }
                
                    $("#cubeviz-legend-componentAttributeProperties").append(
                        "<tr>"
                        + "<td><a href=\"" + property + "\">" + property + "</a></td>"
                        + "<td>" + value + "</td>" +
                        "</tr>"
                    );              
                }
            });
        }
    }
    
    /**
     * @param selectedComponentDimensions any
     * @param forSeries string
     * @param selectedAttribute any
     * @param selectedMeasure any
     */
    public getSelectedObservations(selectedComponentDimensions:any,
        retrievedObservations:any, selectedAttribute:any, selectedMeasure:any) : any
    {
        /**
         * init observation instance which handles the observations later on
         */
        var forXAxis:string = "", forSeries:string = "",
            observation:DataCube_Observation = new DataCube_Observation ();
        
        observation.initialize(
            retrievedObservations,
            selectedComponentDimensions,
            selectedMeasure["http://purl.org/linked-data/cube#measure"]
        );
                
        
        /**
         * set attribute uri, if available
         */
        var selectedAttributeUri:string = "";
        if (true === _.isNull(selectedAttribute) 
            || true === _.isUndefined(selectedAttribute)) {
            selectedAttributeUri = null;
        } else {
            selectedAttributeUri = selectedAttribute.__cv_uri;
        }        
        
        // assign selected dimensions to xAxis and series (yAxis)
        _.each(selectedComponentDimensions, function(selectedDimension){
            // ignore dimensions which have no elements
            if ( 2 > _.keys(selectedDimension.__cv_elements).length) {
                return;
            }
            if ( null == forXAxis ) {
                forXAxis = selectedDimension["http://purl.org/linked-data/cube#dimension"];
            } else {
                forSeries = selectedDimension["http://purl.org/linked-data/cube#dimension"];
            }
        });        
        
        var observationsToReturn:any[] = [],
            seriesElements:any = observation.getAxesElements(forSeries),
            useObservation:number = 0;
        
        /**
         * now we take care about the series
         */         
        _.each(seriesElements, function(seriesElement){
            
            // go through all observations associated with this seriesElement
            // and add their values (measure) if set
            _.each(seriesElement.observations, function(seriesObservation){
                
                useObservation = 0;
                
                if (false === DataCube_Observation.isActive(seriesObservation)){
                    return;
                }
                
                // check if the current observation has to be ignored:
                // it will ignored, 
                //      if attribute uri is set, but the observation
                //      has no value of it
                // and
                //      if the predicate which is labeled with DataCube's 
                //      attribute is not equal to the given selected attribute uri
                if ((   false === _.isNull(selectedAttributeUri)
                        && 
                        ( true === _.isNull(seriesObservation[selectedAttributeUri])
                          || true === _.isUndefined(seriesObservation[selectedAttributeUri])))
                    && 
                        selectedAttributeUri !== seriesObservation ["http://purl.org/linked-data/cube#attribute"]) {
                    // TODO implement a way to handle ignored observations
                    return;
                }
                
                // throw out observation, which does not have all selected dimension elements
                _.each(selectedComponentDimensions, function(dimension){
                    
                    if (2 == useObservation) {
                        return;
                    } else if (2 > useObservation) {
                        useObservation = 0;
                    }
                    
                    _.each(dimension.__cv_elements, function(dimensionElement){                        
                        if (dimensionElement.__cv_uri 
                            == seriesObservation[dimension["http://purl.org/linked-data/cube#dimension"]]) {
                            useObservation = 1;
                        }
                    });
                    
                    // if nothing equal was found, set observation to ignore
                    if (0 == useObservation) {
                        useObservation = 2;
                    }
                });
                
                // use observation
                if (1 === useObservation) {
                    observationsToReturn.push(seriesObservation);
                }
            });
        });
        
        return observationsToReturn;
    }
    
    /**
     * 
     */
    public initialize() : void
    {
        this.render();
    }
    
    /**
     * copied from http://stackoverflow.com/a/14582229
     * Checks if given string is a valid url
     * @param str string String to check
     * @return bool True if given string is a valid url, false otherwise.
     */
    public isValidUrl(str:string) : bool
    {
        return ((new RegExp(
                '^(https?:\\/\\/)?'+                                // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)*[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+                      // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+                  // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+                         // query string
                '(\\#[-a-z\\d_]*)?$','i'                            // fragment locator
            )).test(str)) 
            
            // additional check for . or /
            && (true === _.str.include(str, ".") || true === _.str.include(str, "/"));
    }
    
    /**
     *
     */
    public onClick_adaptedMeasureValueSaveBtn(e) : void 
    {
        var accordingObservation = $(e.target).data("observation"),
            self = this,
            
            $inputField = $(e.target).data("inputField"),
            $measureTd = $(e.target).data("measureTd"),
            $saveBtn = $(e.target);
        
        // set temporary new value, which means, that it will used as long as
        // neccessary, but the original one will persists
        accordingObservation.__cv_temporaryNewValue = $inputField.val();
        
        // replace adapted observation
        _.each (this.app._.data.retrievedObservations, function(observation, key){
            if (observation.__cv_uri === accordingObservation.__cv_uri) {
                self.app._.data.retrievedObservations [key] = accordingObservation;
            }
        });
        
        // restore measure td as it was before the change
        this.restoreMeasureTd($measureTd);
        
        // force CubeViz to update the visualization
        this.triggerGlobalEvent ("onReRender_visualization");
    }
    
    /**
     *
     */
    public onClick_btnShowRetrievedObservations (event) : bool 
    {
        event.preventDefault();
        
        // show overview
        $("#cubeviz-legend-retrievedObservations").slideToggle("slow");
        
        return false;
    }
    
    /**
     *
     */
    public onClick_btnShowSelectedConfiguration(event) : bool 
    {
        event.preventDefault();
        
        // show overview
        $("#cubeviz-legend-selectedConfiguration").slideToggle('slow');
        
        return false;
    }
    
    /**
     *
     */
    public onClick_componentDimensionShowInfo(event) : bool 
    {
        event.preventDefault();
        
        // variables
        var showMoreInformationBtn = $(event.target),
            dimension = showMoreInformationBtn.data("dimension"),
            dimensionElement = showMoreInformationBtn.data("dimensionElement"),
            observationIcon = showMoreInformationBtn.data("observationIcon");
            
        // create an instance of ul
        var infoList = $($("#cubeviz-legend-tpl-componentDimensionInfoList").html());
     
        // go through all dimension element information
        _.each(dimensionElement, function(value, key){
            
            // use related information if its not from CubeViz
            if(false === _.str.startsWith (key, "__cv_")) {                
                // li entry
                infoList.append(CubeViz_View_Helper.tplReplace(
                    $("#cubeviz-legend-tpl-componentDimensionInfoListEntry").html(),
                    {
                        key: key,
                        value: CubeViz_Visualization_Controller.linkify(value)
                    }
                ));
            }
        });
        
        // append generated list to info area and fade it in / out
        $("#cubeviz-legend-componentDimensionInfoDialog")
            .html("")
            .append(CubeViz_View_Helper.tplReplace(
                $("#cubeviz-legend-tpl-componentDimensionInfoHeader").html(),
                dimensionElement
            ))
            .append(infoList)
            .fadeIn("slow");
            
        $("#cubeviz-legend-componentDimensionInfoDialog").dialog("open");
        
        return false;
    }
    
    /**
     *
     */
    public onClick_sortAsc(e) : void 
    {
        /**
         * click to a dimension
         */
        if (false === _.isUndefined($(e.target).data("dimension"))) {
            
            this.app._.data.retrievedObservations = this.sortDimensionsAscOrDesc(
                $(e.target).data("dimension"),
                this.app._.data.retrievedObservations,
                -1,
                1
            );
            
        /**
         * click to a measure
         */
        } else if (false === _.isUndefined($(e.target).data("measure"))) {
            
            this.app._.data.retrievedObservations = this.sortMeasureValuesAscOrDesc(
                $(e.target).data("measure"),
                this.app._.data.retrievedObservations,
                -1,
                1
            );            
        } 
        
        // In this case, there was no valid data attached, so ignore this click
        else { return; }        
        
        // reset legend table
        this.displayRetrievedObservations(
            this.app._.data.retrievedObservations, 
            this.app._.data.selectedComponents.dimensions,
            this.app._.data.selectedComponents.measure,
            this.app._.data.selectedComponents.attribute
        );
    }
    
    /**
     *
     */
    public onClick_sortDesc(e) : void 
    {
        /**
         * click to a dimension
         */
        if (false === _.isUndefined($(e.target).data("dimension"))) {
            
            this.app._.data.retrievedObservations = this.sortDimensionsAscOrDesc(
                $(e.target).data("dimension"),
                this.app._.data.retrievedObservations,
                1,
                -1
            );
            
        /**
         * click to a measure
         */
        } else if (false === _.isUndefined($(e.target).data("measure"))) {
            
            this.app._.data.retrievedObservations = this.sortMeasureValuesAscOrDesc(
                $(e.target).data("measure"),
                this.app._.data.retrievedObservations,
                1,
                -1
            );            
        } 
        
        // In this case, there was no valid data attached, so ignore this click
        else { return; }        
        
        // reset legend table
        this.displayRetrievedObservations(
            this.app._.data.retrievedObservations, 
            this.app._.data.selectedComponents.dimensions,
            this.app._.data.selectedComponents.measure,
            this.app._.data.selectedComponents.attribute
        );
    }
    
    /**
     *
     */
    public onDblClick_measureTd(e) : void 
    {
        // stop proceeding in case, that the td was not dblclicked;
        // this happens, if only some text inside the td was dblclicked
        if (true === _.isUndefined($(e.target).data("observation"))
            || true === _.isNull($(e.target).data("observation"))) {
            return;
        }
        
        // setup variables
        var accordingObservation:any = $(e.target).data("observation"),
            inputValue:string = null,
            selectedMeasureUri:string = this.app._.data.selectedComponents.measure ["http://purl.org/linked-data/cube#measure"];
            
        // check if there was an adaption of the value before, if yes, than
        // use this adapted value as default value for the input field
        if (false === _.isUndefined(accordingObservation.__cv_temporaryNewValue)) {
            inputValue = accordingObservation.__cv_temporaryNewValue;
        } else {
            inputValue = accordingObservation [selectedMeasureUri];
        }
            
        // setup HTML elements
        var $inputField = $("<input type=\"text\" value=\"" + inputValue + "\">"),
            $saveBtn = $("<div class=\"btn btn-primary\" style=\"vertical-align: top;\">Save</div>");
        
        // replace td content with textfield and save button
        $(e.target).html ("")
            .append ($inputField)
            .append ($saveBtn);
        
        // setup save button
        $saveBtn
            .data ("inputField", $inputField)
            .data ("measureTd", $(e.target))
            .data ("observation", accordingObservation)
            .on ("click", $.proxy(this.onClick_adaptedMeasureValueSaveBtn, this));
            
        // set focus to input field
        $inputField.focus();
    }
    
    /**
     *
     */
    public onUpdate_componentDimensions() 
    {
        this.destroy();
        this.initialize();
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
    public render() : CubeViz_View_Abstract
    {
        // get these observations which fits with the given data selection
        var selectedObservations = this.getSelectedObservations(
            this.app._.data.selectedComponents.dimensions,
            this.app._.data.retrievedObservations,
            this.app._.data.selectedComponents.attribute,
            this.app._.data.selectedComponents.measure
        );
        
        var selectedMeasureUri = this.app._.data.selectedComponents.measure["http://purl.org/linked-data/cube#measure"],
            self = this;
        
        /**
         * Show Data Structure Definition and Data set
         */
        this.displayDataStructureDefinition(this.app._.data.selectedDSD);
        this.displayDataset(this.app._.data.selectedDS, this.app._.data.selectedDSD);
        
        /**
         * Selected configuration
         */
        this.displaySelectedDimensions(this.app._.data.selectedComponents.dimensions);
        this.displaySelectedMeasureAndAttribute(
            this.app._.data.selectedComponents.measure,
            this.app._.data.selectedComponents.attribute
        );
        
        /**
         * Sort and render observation list 
         */
        this.displayRetrievedObservations(
        
            // sort list ascending
            this.sortMeasureValuesAscOrDesc(
                this.app._.data.selectedComponents.measure, selectedObservations, -1, 1
            ),
            this.app._.data.selectedComponents.dimensions,
            this.app._.data.selectedComponents.measure,
            this.app._.data.selectedComponents.attribute
        );
        
        // attach dialog which contains model information
        CubeViz_View_Helper.attachDialogTo(
            $("#cubeviz-legend-componentDimensionInfoDialog"),
            {closeOnEscape: true, showCross: true, height: 450, width: "50%"}
        );
        
        // remove event handler
        $("#cubeviz-legend-btnShowRetrievedObservations").off();
        $("#cubeviz-legend-btnShowSelectedConfiguration").off();
        $(".cubeviz-legend-componentDimensionShowInfo").off();
        $("#cubeviz-legend-sortByTitle").off();                
        $("#cubeviz-legend-sortByValue").off();
        
        /**
         * Delegate events to new items of the template
         */
        this.bindUserInterfaceEvents({
            "click #cubeviz-legend-btnShowSelectedConfiguration": 
                this.onClick_btnShowSelectedConfiguration,
                
            "click #cubeviz-legend-btnShowRetrievedObservations": 
                this.onClick_btnShowRetrievedObservations,
                
            "click .cubeviz-legend-componentDimensionShowInfo": 
                this.onClick_componentDimensionShowInfo,
        });
        
        return this;
    }
    
    /**
     * $measureTd any
     */
    public restoreMeasureTd($measureTd:any) : void 
    {
        var accordingObservation = $measureTd.data("observation"),
            selectedMeasureUri:string = this.app._.data.selectedComponents.measure ["http://purl.org/linked-data/cube#measure"];
        
        // update td
        $measureTd
            .html (
                accordingObservation.__cv_temporaryNewValue +
                " &nbsp; <small>(Original: " + accordingObservation[selectedMeasureUri] + ")"
            );
    }
    
    /**
     * @param selectedComponent any
     * @param observations any
     * @param ifLower number If the first value is lower than the second one
     * @param ifHigher number If the first value is higher than the second one
     */
    public sortDimensionsAscOrDesc(selectedComponent:any, observations:any, ifLower:number, ifHigher:number) 
    {
        var accordingFieldLabel:string = "",
            anotherAccordingFieldLabel:string = "",
            observationList = new CubeViz_Collection("__cv_uri"),
            selectedComponentUri:string = selectedComponent["http://purl.org/linked-data/cube#dimension"];
            
        observationList.addList(observations);
        
        // sort observations
        observationList._.sort(function(observation, anotherObservation){
            
            // get dimension element label for a observation
            accordingFieldLabel = DataCube_Component.findDimensionElement(
                selectedComponent.__cv_elements, observation [selectedComponentUri]
            ).__cv_niceLabel;
            
            // get dimension element label for the other observation
            anotherAccordingFieldLabel = DataCube_Component.findDimensionElement(
                selectedComponent.__cv_elements, anotherObservation[selectedComponentUri]
            ).__cv_niceLabel;
            
            return accordingFieldLabel < anotherAccordingFieldLabel
                ? ifLower : ifHigher;
        });
        
        return observationList.toObject();
    }
    
    /**
     * @param selectedComponent any
     * @param observations any
     * @param ifLower number If the first value is lower than the second one
     * @param ifHigher number If the first value is higher than the second one
     */
    public sortMeasureValuesAscOrDesc(selectedComponent:any, observations:any, ifLower:number, ifHigher:number) 
    {
        var anotherObservationValue:string = null,
            observationList:CubeViz_Collection = new CubeViz_Collection ("__cv_uri"),
            observationValue:string = null,
            selectedComponentUri = selectedComponent["http://purl.org/linked-data/cube#measure"];
        
        observationList.addList(observations);
        
        // sort observations
        observationList._.sort(function(observation, anotherObservation){
            
            // get value of one observation
            observationValue = DataCube_Observation.parseValue (
                observation, selectedComponentUri
            );
            
            // get value of another observation
            anotherObservationValue = DataCube_Observation.parseValue (
                anotherObservation, selectedComponentUri
            );
                         
            return observationValue < anotherObservationValue
                ? ifLower : ifHigher;
        });
        
        return observationList.toObject();
    }
}
