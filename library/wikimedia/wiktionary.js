/**
 * library plugin for wiktionary search
 */


module.exports = new function() {

    /** variables **/
    this.id = 'wiktionary';
    this.title = 'Wiktionary';
    this.subtitle = 'The free dictionary';
    this.tags = ['dictionary'];

    /** accompanying resources **/
    this.logo = '99px-WiktionaryEn.svg.png';
    this.info = 'wiktionary-info.html';

    /** signal whether or not plugin can process a query **/
    this.claim = function(x) {
        var words = x.split(' ');
        if (words.length!=1) return 0;
        var score = 1;
        [':', '#', '$', '%'].map(function(z) {
            if (x.includes(z)) score = 0;
        })
        return Math.min(0.8, Math.max(0, score));
    };

    /** construct a url for an API call **/
    this.url = function(query) {
        query = query.split(' ').join('%20');
        var url = 'https://en.wiktionary.org/w/api.php?action=query'
            +'&titles='+query+'&prop=extracts&format=json&formatversion=2'
        return url;
    }

    /** transform a raw result from an API call into a display object **/
    this.process = function(data) {
        var result = JSON.parse(data)
        if (result['batchcomplete']!==true) {
            return {status: 0, data: result};
        }
        result = result['query']['pages'][0]
        return {status: 1, data: result.extract};
    }

    /** construct a URL to an external information page **/
    this.external = function(query) {
        query = query.split(' ').join('_');
        return 'https://en.wiktionary.org/wiki/'+query;
    }

}();

