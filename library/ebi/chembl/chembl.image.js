/**
 * plugin for EBI's Chembl Compound Image
 */


module.exports = new function() {

    /** variables **/
    this.id = "chembl.image";
    this.title = "ChEMBL";
    this.subtitle = "Compound structure (image)";
    this.tags = ["chemistry", "compound", "structure"];

    /** accompanying resources **/
    this.logo = 'ChEMBL_clear.png';
    this.info = "chembl-info.html";

    var chembl = "https://www.ebi.ac.uk/chembl/"

    /** helper checks if a string is a valid id, e.g. CHEMBL25 **/
    isChemblId = function(query) {
        return query.trim().startsWith('CHEMBL');
    };

    /** signal whether or not plugin can process a query **/
    this.claim = function(query) {
        query = query.trim();
        if (query.length < 4) return 0;
        if (isChemblId(query)) return 1;
        // long queries can be a drug names, short names possibly gene names
        // so claim long words more strongly
        if (query.length > 6) return 0.7;
        return 0.3;
    };

    /** construct a url for an API call **/
    this.url = function(query, index) {
        if (isChemblId(query)) {
            return chembl + 'api/data/image/' + query + '?format=svg&engine=indigo';
        }
        query = query.replace(' ', '%20');
        return chembl + 'glados-es/chembl_molecule/_search?q='+query;
    };

    /** transform a raw result from an API call into a display object **/
    this.process = function(data, index) {
        // check whether response is an image; return image
        var prefix = '<?xml version="1.0" encoding="UTF-8"?>\n';
        if (data.startsWith(prefix)) {
            return {status: 1, data: data.substr(prefix.length)};
        }
        // assume it is a search result
        var result = JSON.parse(data);
        var hits = result['hits']['hits'];
        return {status: 0.5, data: hits[0]['_id']};
    };

    /** construct a URL to an external information page **/
    this.external = function(query, index) {
        return chembl + "beta/g/#search_results/all/query="+query;
    };

}();
