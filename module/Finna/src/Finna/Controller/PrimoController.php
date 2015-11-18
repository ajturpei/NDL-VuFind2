<?php
/**
 * Primo Central Controller
 *
 * PHP version 5
 *
 * Copyright (C) The National Library of Finland 2015.
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
 * @package  Controller
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
namespace Finna\Controller;

/**
 * Primo Central Controller
 *
 * @category VuFind2
 * @package  Controller
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
class PrimoController extends \VuFind\Controller\PrimoController
{
    use SearchControllerTrait;

    /**
     * Search class family to use.
     *
     * @var string
     */
    protected $searchClassId = 'Primo';

    /**
     * Home action
     *
     * @return mixed
     */
    public function homeAction()
    {
        $this->layout()->searchClassId = $this->searchClassId;
        return parent::homeAction();
    }

    /**
     * Handle onDispatch event
     *
     * @param \Zend\Mvc\MvcEvent $e Event
     *
     * @return mixed
     */
    public function onDispatch(\Zend\Mvc\MvcEvent $e)
    {
        $primoHelper = $this->getViewRenderer()->plugin('primo');
        if (!$primoHelper->isAvailable()) {
            throw new \Exception('Primo is disabled');
        }

        return parent::onDispatch($e);
    }

    /**
     * Search action -- call standard results action
     *
     * @return mixed
     */
    public function searchAction()
    {
        if ($this->getRequest()->getQuery()->get('combined')) {
            $this->saveToHistory = false;
        }
        $this->initCombinedViewFilters();
        $view = parent::resultsAction();
        $this->initSavedTabs();

        return $view;
    }
}

