<?php

class LicenseXML
{
    private $dom;
    private $name_dom;

    # Configuration
    private $cc_api_root      = "http://api.creativecommons.org/rest/1.5";
    private $license_name_cmd = "details?license-uri";

    # Loads licenses.xml
    function __construct($license_xml_filename) {
        $this->name_dom = new DomDocument();
        $this->dom = new DomDocument();
        $this->dom->load($license_xml_filename);
    }

    # Returns an array of jurisdiction arrays.
    # Each row in the array consists of {id, languages, uri}
    function getJurisdictions($launched="") {
        $jurisdictions = array();

        $xpath = new Domxpath($this->dom);
        if ($launched == "" or $launched == "all") {
            $result = $xpath->query("//license-info/jurisdictions/jurisdiction-info");
        } else {
            $result = $xpath->query("//license-info/jurisdictions/jurisdiction-info[@launched='$launched']");
        }

        foreach ($result as $j) {
            $jurisdiction = array();
            $jurisdiction_id = $j->getAttribute('id');
            $jurisdiction['id'] = $jurisdiction_id;

            foreach ($j->childNodes as $child) {
                if ($child->nodeName == 'languages') {
                    $jurisdiction['languages'] = $child->nodeValue;
                } else if ($child->nodeName == 'uri') {
                    $jurisdiction['uri'] = $child->nodeValue;
                }
            }

            $jurisdictions[$jurisdiction_id] = $jurisdiction;
        }
        return $jurisdictions;
    }

    # Returns an array of license arrays.
    # Each row in the array consists of {id, jurisdictions}
    function getLicenses($licenseclass='standard') {
        $licenses = array();

        # Query document
        $xpath = new Domxpath($this->dom);
        if ($licenseclass == '' or $licenseclass=='all') {
            $result = $xpath->query("//licenseclass/license");
        } else {
            $result = $xpath->query("//licenseclass[@id='$licenseclass']/license");
        }

        foreach ($result as $l) {
            $license = array();
            $license_id = $l->getAttribute('id');
            $license['id'] = $license_id;

            $jurisdictions = array();
            foreach ($l->childNodes as $j) {
                if ($j->nodeName == 'jurisdiction') {
                    $jurisdiction_id = $j->getAttribute('id');
                    if ($jurisdiction_id != '') {
                        array_push($jurisdictions, $jurisdiction_id);
                    }
                }
            }
            $license['jurisdictions'] = $jurisdictions;
            
            $licenses[$license_id] = $license;
        }
        return $licenses;
    }
    
    # Get a listing of the most current versions of all licenses for given jurisdiction
    function getLicensesCurrent($jurisdiction='-', $licenseclass='standard') {
        $licenses = $this->getLicenses($licenseclass);
        $current_licenses = array();
        
        foreach ($licenses as $license) {
            $license_id = $license['id'];

            $current_version = 0;
            $xpath = new Domxpath($this->dom);
            if ($jurisdiction == '' or $jurisdiction == 'all') {
                $versions = $xpath->query("//licenseclass/license[@id='$license_id']/jurisdiction/version");
            } else {
                $versions = $xpath->query("//licenseclass[@id='$licenseclass']/license[@id='$license_id']/jurisdiction[@id='$jurisdiction']/version");
            }
            foreach ($versions as $version) {
                $version_id = $version->getAttribute("id");
                if ($version_id > $license['version']) {
                    $license['version'] = $version_id;
                    $license['uri'] = $version->getAttribute("uri");
                }
            }
            if ($license['version'] > 0) {
                $current_licenses[$license_id] = $license;
            }
        }
        return $current_licenses;     
    }

    function getLicenseName($uri) {
        $url = $this->cc_api_root . "/" . $this->license_name_cmd . "=$uri";
        $xml = file_get_contents($url);

        $this->name_dom->loadXML($xml);

        $xpath = new Domxpath($this->name_dom);
        $result = $xpath->query("//result/license-name");
        return $result->item(0)->nodeValue;
    }

}

/***
 * Commandline routine for checking licenses.xml
 ***

 * Usage:
 *  $ php licenses.php jurisdictions
 *  $ php licenses.php licenses
 *  $ php licenses.php licenses_current
 * 
$command = $argv[1];

$license_xml = new LicenseXml("../license_xsl/licenses.xml");

switch($command) {
    case "jurisdictions":
        $launched = "all";
        foreach ($license_xml->getJurisdictions($launched) as $j) {
            printf("%-10s %-21s %s\n", $j['id'], $j['languages'], $j['uri']);
        }
        break;
    case "licenses":
        $licenses = $license_xml->getLicenses("all");
        foreach ($licenses as $license) {
            printf("%-12s %s\n", $license['id'], join(",", $license['jurisdictions']));
        }
        $license_xml->printLicenses("all");
        break;
    case "licenses_current":
        $jurisdiction="-";
        $licenseclass="standard";
        print("Jurisdiction: $jurisdiction\n");
        foreach ($license_xml->getLicensesCurrent($jurisdiction, $licenseclass) as $license) {
            printf("  %-12s %-12s %s\n", $license['id'], $license['version'], $license['uri']);
        }
        break;
    default:
        print "Usage:  $argv[0] [jurisdictions|licenses|licenses_current]\n";
}

exit(0);

***/

?>
