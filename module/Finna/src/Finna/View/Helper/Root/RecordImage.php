<?php
/**
 * Header view helper
 *
 * PHP version 5
 *
 * Copyright (C) The National Library of Finland 2014.
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
 * @link     http://vufind.org   Main Site
 */
namespace Finna\View\Helper\Root;

/**
 * Header view helper
 *
 * @category VuFind2
 * @package  View_Helpers
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org   Main Site
 */
class RecordImage extends \Zend\View\Helper\AbstractHelper
{
    /**
     * Record view helper
     *
     * @var Zend\View\Helper\Record
     */
    protected $record;

    /**
     * Assign record image URLs to the view and return header view helper.
     *
     * @param \Finna\View\Helper\Root\Record $record Record helper.
     *
     * @return FInna\View\Helper\Root\Header
     */
    public function __invoke(\Finna\View\Helper\Root\Record $record)
    {
        $this->record = $record;
        $view = $this->getView();

        $view->smallThumb = $record->getRecordImage('small');
        $view->mediumThumb = $record->getRecordImage('medium');
        $view->largeThumb = $record->getRecordImage('large');

        $allThumbsSmall = array_keys($record->getAllRecordImages('small'));
        $allThumbsLarge = array_keys($record->getAllRecordImages('medium'));
        $thumbs = array();

        for ($i=0; $i<count($allThumbsSmall); $i++) {
            $thumbs[] = array(
                'small' => $allThumbsSmall[$i], 
                'large' => $allThumbsLarge[$i]
            );
        }

        $view->allThumbs = $thumbs;
        return $this;
    }

    /**
     * Return URL to large record image.
     *
     * @param int $index Record image index.
     *
     * @return mixed string URL or false if no 
     * image with the given index was found.
     */  
    public function getLargeThumb($index = 0)
    {
        $recordHelper = $this->getView()->plugin('record');
        $images = $recordHelper->getAllRecordImages('large');

        if (count($images) > $index) {
            $images = array_keys($images);
            return $images[$index];
        }
        return false;
    }

    /**
     * Return rendered record image HTML.
     *
     * @param string $type Page type (list, record).
     *
     * @return string 
     */  
    public function render($type = 'list')
    {
        $view = $this->getView();
        $view->type = $type;

        return $view->render('RecordDriver/SolrDefault/record-image.phtml');    
    }
}
