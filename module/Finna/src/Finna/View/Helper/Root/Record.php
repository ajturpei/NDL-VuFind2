<?php
/**
 * Record driver view helper
 *
 * PHP version 5
 *
 * Copyright (C) Villanova University 2010.
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
 * @package  View_Helpers
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
namespace Finna\View\Helper\Root;

/**
 * Record driver view helper
 *
 * @category VuFind2
 * @package  View_Helpers
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
class Record extends \VuFind\View\Helper\Root\Record
{
    /**
     * Return record image URL.
     *
     * @param string $size Size of requested image
     *
     * @return mixed
     */
    public function getRecordImage($size = 'small')
    {
        $params = $this->driver->tryMethod('getRecordImage', array($size));
        if (empty($params)) {
            return $this->getThumbnail($size);
        }

        $urlHelper = $this->getView()->plugin('url');
        $params['size'] = $size;
        // Hide image url from UI
        unset($params['url']);
        return $urlHelper('cover-show') . '?' . http_build_query($params);
    }

    /**
     * Return all record image URLs.
     *
     * @param string $size Size of requested images
     *
     * @return mixed
     */    
    public function getAllRecordImages($size = 'small')
    {
        $images = $this->driver->trymethod('getAllThumbnails', array($size));
        if (empty($images)) {
            return array($this->getRecordImage($size) => '');
        }

        $urlHelper = $this->getView()->plugin('url');
        $id = $this->driver->getUniqueId();

        $index = 0;
        $urls = array();        
        foreach ($images as $img) {
            $params = array('id' => $id, 'index' => $index++, 'size' => $size);
            $urls[$urlHelper('cover-show') . '?' . http_build_query($params)] = '';
        }
        return $urls;
    }
}
