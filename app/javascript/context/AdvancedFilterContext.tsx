import React from 'react';
interface AdvancedFilterContextType {
    actionTypeFilter: string;
    setActionTypeFilter: React.Dispatch<React.SetStateAction<string>>;
    providerFilterList: string[];
    setProviderFilterList: React.Dispatch<React.SetStateAction<string[]>>;
    toggleProviderFilterList: (provider: string) => void;
    advancedCategories: string[];
    setAdvancedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    toggleAdvancedCategories: (category: string ) => void;
}

export const AdvancedFilterContext = React.createContext<AdvancedFilterContextType | null>(null);

export const AdvancedFilterProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [actionTypeFilter, setActionTypeFilter] = React.useState<string>('');
    const [providerFilterList, setProviderFilterList] = React.useState([]);
    const [advancedCategories, setAdvancedCategories] = React.useState([]);
    const toggleProviderFilterList = (provider) => {
        setProviderFilterList(prevList => {
            if (prevList.includes(provider)) {
                return prevList.filter(item => item !== provider);
            }
            else {
                return [...prevList, provider];
            }
        });
    }
    const toggleAdvancedCategories = (category) => {
        setAdvancedCategories(prevCategories => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter(item => item !== category);
            }
            else {
                return [...prevCategories, category];
            }
        });
    }
    return (
        <AdvancedFilterContext.Provider
            value={{
                actionTypeFilter,
                setActionTypeFilter,
                providerFilterList,
                setProviderFilterList,
                toggleProviderFilterList,
                advancedCategories,
                setAdvancedCategories,
                toggleAdvancedCategories
            }}>
            {children}
        </AdvancedFilterContext.Provider>);
};
