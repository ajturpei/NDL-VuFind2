<?php
/**
 * ILS Driver Factory Class
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
 * @package  ILS_Drivers
 * @author   Ere Maijala <ere.maijala@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:hierarchy_components Wiki
 */
namespace Finna\ILS\Driver;
use Zend\ServiceManager\ServiceManager;

/**
 * ILS Driver Factory Class
 *
 * @category VuFind2
 * @package  ILS_Drivers
 * @author   Ere Maijala <ere.maijala@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:hierarchy_components Wiki
 *
 * @codeCoverageIgnore
 */
class Factory
{
    /**
     * Factory for VoyagerRestful driver.
     *
     * @param ServiceManager $sm Service manager.
     *
     * @return VoyagerRestful
     */
    public static function getVoyagerRestful(ServiceManager $sm)
    {
        $ils = $sm->getServiceLocator()->get('VuFind\ILSHoldSettings');
        return new VoyagerRestful(
            $sm->getServiceLocator()->get('VuFind\DateConverter'),
            $ils->getHoldsMode(), $ils->getTitleHoldsMode()
        );
    }
}
