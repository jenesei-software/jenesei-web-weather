import { useStore } from 'effector-react';

import '../styles/home-settings-choice.css'

import LocationIcon from '../../../../assets/icon/location.svg'
import DropDownIcon from '../../../../assets/icon/drop-down.svg'
import DropUpIcon from '../../../../assets/icon/drop-up.svg'

import { $showSearch, changeShowSearch } from '../../../../functions/stores/show-search';

interface IHomeSettingsChoice {
    infoLocation: any
}
export const HomeSettingsChoice = (params:IHomeSettingsChoice) => {
    const showSearch = useStore($showSearch);
    return (
        <div className='HomeSettingsChoice' onClick={changeShowSearch}>
            <img className='HomeSettingsChoice__LocationIcon' src={LocationIcon} alt="Location Icon" />
            <div className='HomeSettingsChoice__Label'>
                {params.infoLocation?.LocalizedName}
            </div>
            {showSearch ?
                <img className='HomeSettingsChoice__DropIcon' src={DropDownIcon} alt="Drop Down Icon" />
                :
                <img className='HomeSettingsChoice__DropIcon' src={DropUpIcon} alt="Drop Up Icon" />
            }
        </div>
    );
};
