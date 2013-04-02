<?PHP 

namespace spouts\rss;

/**
 * Plugin for fetching the news from heise with the full text
 *
 * @package    plugins
 * @subpackage news
 * @copyright  Copyright (c) Tobias Zeising (http://www.aditu.de)
 * @license    GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
 * @author     Tobias Zeising <tobias.zeising@aditu.de>
 * @author     Daniel Seither <post@tiwoc.de>
 */
class heise extends feed {


    /**
     * name of spout
     *
     * @var string
     */
    public $name = 'heise news';
    
    
    /**
     * description of this source type
     *
     * @var string
     */
    public $description = 'This feed fetches the heise news with full content (not only the header as content)';
    
    
    /**
     * config params
     * array of arrays with name, type, default value, required, validation type
     *
     * - Values for type: text, password, checkbox, select
     * - Values for validation: alpha, email, numeric, int, alnum, notempty
     *
     * When type is "select", a new entry "values" must be supplied, holding
     * key/value pairs of internal names (key) and displayed labels (value).
     * See /spouts/rss/heise for an example.
     * 
     * e.g.
     * array(
     *   "id" => array(
     *     "title"      => "URL",
     *     "type"       => "text",
     *     "default"    => "",
     *     "required"   => true,
     *     "validation" => array("alnum")
     *   ),
     *   ....
     * )
     *
     * @var bool|mixed
     */
    public $params = array(
        "section" => array(
            "title"      => "Section",
            "type"       => "select",
            "values"     => array(
                "main"   => "Hauptseite",
                "ct"     => "c't",
                "ix"     => "iX",
                "tr"     => "Technology Review",
                "mac"    => "Mac &amp; i",
                "mobil"  => "mobil",
                "sec"    => "Security",
                "net"    => "Netze",
                "open"   => "Open Source",
                "dev"    => "Developer",
                "tp"     => "Telepolis",
                "resale" => "Resale",
                "foto"   => "Foto",
                "autos"  => "Autos"
            ),
            "default"    => "main",
            "required"   => true,
            "validation" => array()
        )
    );


    /**
     * addresses of feeds for the sections
     */
    private $feedUrls = array(
        "main"   => "http://www.heise.de/newsticker/heise-atom.xml",
        "ct"     => "http://www.heise.de/ct/rss/artikel-atom.xml",
        "ix"     => "http://www.heise.de/ix/news/news-atom.xml",
        "tr"     => "http://www.heise.de/tr/news-atom.xml",
        "mac"    => "http://www.heise.de/mac-and-i/news-atom.xml",
        "mobil"  => "http://www.heise.de/mobil/newsticker/heise-atom.xml",
        "sec"    => "http://www.heise.de/security/news/news-atom.xml",
        "net"    => "http://www.heise.de/netze/rss/netze-atom.xml",
        "open"   => "http://www.heise.de/open/news/news-atom.xml",
        "dev"    => "http://www.heise.de/developer/rss/news-atom.xml",
        "tp"     => "http://www.heise.de/tp/news-atom.xml",
        "resale" => "http://www.heise.de/resale/rss/resale-atom.xml",
        "foto"   => "http://www.heise.de/foto/rss/news-atom.xml",
        "autos"  => "http://www.heise.de/autos/rss/news-atom.xml",
    );


    /**
     * delimiters of the article text
     *
     * elements: start tag, attribute of start tag, value of start tag attribute, end
     */
    private $textDivs = array(
        array("div", "class", "meldung_wrapper", '<!-- AUTHOR-DATA-MARKER-BEGIN'), // main, ix, mac, mobil, sec, net, open, dev, resale, foto
        array("p", "class", "artikel_datum", '<p class="artikel_option">'),        // ct
        array("div", "class", "aufmacher", '<!-- AUTHOR-DATA-MARKER-BEGIN'),       // tr
        array("div", "class", "datum_autor", '<div class="artikel_fuss">'),        // mac
        array("p", "class", "vorlauftext", '<div class="artikel_fuss">'),          // mobil
        array("div", "id", "blocon", '</div>'),                                    // tp
        array("span", "class", "date", '<div xmlns:v="http://rdf'),                // tp
        array("div", "class", "artikel_content", '<div class="artikel_fuss">'),    // resale
        array("div", "id", "artikel_shortnews", '<p class="editor">'),             // autos
    );


    /**
     * loads content for given source
     *
     * @return void
     * @param string $url
     */
    public function load($params) {
        parent::load(array( 'url' => $this->feedUrls[$params['section']]) );
    }
    
    
    /**
     * returns the content of this item
     *
     * @return string content
     */
    public function getContent() {
        if($this->items!==false && $this->valid()) {
            $originalContent = file_get_contents($this->getLink());
            foreach($this->textDivs as $div) {
                $content = $this->getTag($div[1], $div[2], $originalContent, $div[0], $div[3]);
                if(is_array($content) && count($content)>=1) {
                    $content = $content[0];
                    $content = preg_replace(',<a([^>]+)href="([^>"\s]+)",ie',
                                            '"<a\1href=\"" . $this->absolute("\2", "http://www.heise.de") . "\""',
                                            $content);
                    $content = preg_replace(',<img([^>]+)src="([^>"\s]+)",ie',
                                            '"<img\1src=\"" . $this->absolute("\2", "http://www.heise.de") . "\""',
                                            $content);
                    return $content;
                }
            }
        }
        return parent::getContent();
    }
    
    
    /**
     * get tag by attribute
     * taken from http://www.catswhocode.com/blog/15-php-regular-expressions-for-web-developers
     *
     * @return string content
     * @return string $attr attribute
     * @return string $value necessary value
     * @return string $xml data string
     * @return string $tag optional tag
     */
    private function getTag($attr, $value, $xml, $tag=null, $end=null) {
        if(is_null($tag))
            $tag = '\w+';
        else
            $tag = preg_quote($tag);

        if(is_null($end))
            $end = '</\1>';
        else
            $end = preg_quote($end);

        $attr = preg_quote($attr);
        $value = preg_quote($value);
        $tag_regex = '|<('.$tag.')[^>]*'.$attr.'\s*=\s*([\'"])'.$value.'\2[^>]*>(.*?)'.$end.'|ims';
        preg_match_all($tag_regex, $xml, $matches, PREG_PATTERN_ORDER);
        return $matches[3];
    }
    
    
    /**
     * convert relative url to absolute
     *
     * @return string absolute url
     * @return string $relative url
     * @return string $absolute url
     */
    public function absolute($relative, $absolute) {
        if (preg_match(',^(https?://|ftp://|mailto:|news:),i', $relative))
            return $relative;
        return $absolute . $relative;
    }
}
