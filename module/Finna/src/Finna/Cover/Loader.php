<?php
/**
 * Record image loader
 *
 * PHP version 5
 *
 * Copyright (C) Villanova University 2007.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @category VuFind2
 * @package  Cover_Generator
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/use_of_external_content Wiki
 */
namespace Finna\Cover;

/**
 * Record image loader
 *
 * @category VuFind2
 * @package  Cover_Generator
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/use_of_external_content Wiki
 */
class Loader extends \VuFind\Cover\Loader
{

    protected $url;
    protected $id;
    protected $index;

    /**
     * Load an record image.
     *
     * @param \Vufind\RecordDriver\SolrDefault $driver Record
     * @param string                           $size   Requested size
     * @param int                              $index  Image index.
     *
     * @return void
     */
    public function loadRecordImage(
        \VuFind\RecordDriver\SolrDefault $driver, $size, $index = 0
    ) {
        $this->size = $size;
        $this->index = $index;
        $params = $driver->getRecordImage('large', $index);

        if (isset($params['url'])) {
            $this->id = $params['id'];
            $this->url = $params['url'];
            return parent::fetchFromAPI();
        }
    }

    /**
     * Get all valid identifiers as an associative array.
     *
     * @return array
     */
    protected function getIdentifiers()
    {
        if ($this->url) {
            return array('url' => $this->url );
        } else {
            return parent::getIdentifiers();
        }
    }

    /**
     * Support method for fetchFromAPI() -- set the localFile property.
     *
     * @param array $ids IDs returned by getIdentifiers() method
     *
     * @return void
     */
    protected function determineLocalFile($ids)
    {
        if (isset($this->url)) {            
            return $this->getCachePath($this->size, $this->id . '-' . $this->index);
        } else {
            return parent::determineLocalFile($ids);
        }
    }

    /**
     * Load image from URL, store in cache if requested, display if possible.
     *
     * @param string $url   URL to load image from
     * @param string $cache Boolean -- should we store in local cache?
     *
     * @return bool         True if image loaded, false on failure.
     */
    protected function processImageURL($url, $cache = true)
    {
        // Attempt to pull down the image:
        $result = $this->client->setUri($url)->send();
        if (!$result->isSuccess()) {
            $this->debug("Failed to retrieve image from " + $url);
            return false;
        }

        $image = $result->getBody();
        
        if ('' == $image) {
            return false;
        }


        // Figure out file paths -- $tempFile will be used to store the
        // image for analysis.  $finalFile will be used for long-term storage if
        // $cache is true or for temporary display purposes if $cache is false.
        $tempFile = str_replace('.jpg', uniqid(), $this->localFile);
        $finalFile = $cache ? $this->localFile : $tempFile . '.jpg';

        // Write image data to disk:
        if (!@file_put_contents($tempFile, $image)) {
            throw new \Exception("Unable to write to image directory.");
        }

        // We can't proceed if we don't have image conversion functions:
        if (!is_callable('imagecreatefromstring')) {
            return false;
        }


        // Try to create a GD image and rewrite as JPEG, fail if we can't:
        if (!($imageGD = @imagecreatefromstring($image))) {
            return false;
        }

        list($width, $height, $type) = @getimagesize($tempFile);
        
        // Resize if needed
        $coverWidths = isset($this->config->Content->coverwidth) 
            ? $this->config->Content->coverwidth
            : null
        ;
        $coverHeights = isset($this->config->Content->coverheight) 
            ? $this->config->Content->coverheight
            : null
        ;
        $coverMaxHeights = isset($this->config->Content->covermaxheight) 
            ? $this->config->Content->covermaxheight
            : null
        ;

        $reqWidth = isset($coverWidths[$this->size]) 
            ? $coverWidths[$this->size]
            : false
        ;
        $reqHeight = isset($coverHeights[$this->size]) 
            ? $coverHeights[$this->size]
            : false
        ;
        $maxHeight = isset($coverMaxHeights[$this->size]) 
            ? $coverMaxHeights[$this->size]
            : $reqHeight
        ;

        if ($reqWidth && $reqHeight) {
            $bg = isset($this->config->Content->coverbackground) 
                ? $this->config->Content->coverbackground 
                : 'ffffff'
            ;
            if ($height > $maxHeight && $height > $width) {
                $reqHeight = $reqWidth * $height / $width;
                if ($reqHeight > $maxHeight) {
                    $reqHeight = $maxHeight;
                }
            }
            $imageGDResized = imagecreatetruecolor($reqWidth, $reqHeight);
            $background = imagecolorallocate(
                $imageGDResized, hexdec(substr($bg, 0, 2)),
                hexdec(substr($bg, 2, 2)), hexdec(substr($bg, 4, 2))
            );
            imagefill($imageGDResized, 0, 0, $background);

            // If both dimensions are smaller than the new image, 
            // just copy to center. Otherwise resample to fit if necessary.
            if ($width < $reqWidth && $height < $reqHeight) {
                $imgX = floor(($reqWidth - $width) / 2);
                $imgY = 0; // no centering here.. floor(($reqHeight - $height) / 2);
                imagecopy(
                    $imageGDResized, $imageGD, $imgX, $imgY, 0, 0, $width, $height
                );
                if (!@imagejpeg($imageGDResized, $finalFile)) {
                    return false;
                }
            } elseif ($width > $reqWidth || $height > $reqHeight) {
                if (($width / $height) * $reqHeight < $reqWidth) {
                    $newHeight = $reqHeight;
                    $newWidth = round($newHeight * ($width / $height));
                    $imgY = 0;
                    $imgX = round(($reqWidth - $newWidth) / 2);
                    imagecopyresampled(
                        $imageGDResized, $imageGD, $imgX, $imgY, 0, 0, 
                        $newWidth, $newHeight, $width, $height
                    );
                } else {
                    $newWidth = $reqWidth;
                    $newHeight = round($newWidth * ($height / $width));
                    $imgX = 0;
                    $imgY = 0;
                    imagecopyresampled(
                        $imageGDResized, $imageGD, $imgX, $imgY, 0, 0, 
                        $newWidth, $newHeight, $width, $height
                    );
                }
                if (!@imagejpeg($imageGDResized, $finalFile)) {
                    return false;
                }
            } else {
                if (!@imagejpeg($imageGD, $finalFile)) {
                    return false;
                }
            }

            // We no longer need the temp file:
            @unlink($tempFile);
        } else {
            // Move temporary file to final location:
            if (!$this->validateAndMoveTempFile($image, $tempFile, $finalFile)) {
                return false;
            }        
        }


        // Display the image:
        $this->contentType = 'image/jpeg';
        $this->image = file_get_contents($finalFile);

        // If we don't want to cache the image, delete it now that we're done.
        if (!$cache) {
            @unlink($finalFile);
        }

        return true;
    }
}
