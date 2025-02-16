'use client'

import {useEffect, useState} from "react";
import {
    AcademicPosition,
    FilterState, Grant,
    GrantDatabase,
    RepresentingVSO,
    SortBy,
    SortOrder
} from "@/internal/types";
import {filterGrants} from "@/internal/filter";
import {ResultView} from "@/components/ResultView";
import {readDatabase} from "@/internal/backend";
import {Filter} from "@/components/Filter";

const SearchInput = ({ value, onChange, onSearch }: { value: string, onChange: (value: string) => void, onSearch: (value: string) => void }) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(value);
        } else if (e.key === ' ') {
            onSearch(value);
        }
    };

    return (
        <input
            className="w-full rounded-3xl py-3 pl-6 pr-3 bg-white text-black-1000"
            type="search"
            placeholder="What do you need funding for?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
        />
    );
};

export default function Home() {
    let [filterState, setFilterState] = useState<FilterState>({
        minAmount: null,
        positions: [],
        representingVSOs: [],
        sortBy: SortBy.defaultValue,
        sortOrder: SortOrder.defaultValue
    });

    let [inputValue, setInputValue] = useState("");
    let [searchQuery, setSearchQuery] = useState("");
    let [grantDatabase, setGrantDatabase] = useState<GrantDatabase|null>(null);

    // Load the grant database
    useEffect(() => {
        const fetchGrants = async () => {
            try {
                const data = await readDatabase();
                console.log('Fetched grants:', data);
                setGrantDatabase(data);
            } catch (error) {
                console.error('Error loading database:', error);
            }
        };
        fetchGrants();
    }, []);

    let eligibleGrants = [] as Grant[];
    if(grantDatabase !== null) {
        console.log('Processing grants from database:', grantDatabase);
        let grants = Object.values(grantDatabase);
        console.log('Grants array after Object.values:', grants);
        eligibleGrants = filterGrants(grants, filterState);
        console.log('Eligible grants after filtering:', eligibleGrants);
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="bg-cardinal-red-dark w-full pt-10">
                <div className="container mx-auto md:p-4 md:pb-10">
                    <h1 className="text-center text-4xl font-bold my-6 px-1 text-white">
                        <span className="inline-block">Need money for a </span>{' '}
                        <span className="underline">project</span>,{' '}
                        <span className="inline-block">but unsure how to fund it?</span>
                    </h1>
                    <p className="text-center text-lg mb-6 mt-9 px-1 text-white">
                        <span className="inline-block">
                            Stanford has money, but it's often tucked away. Ergo, this search engine!
                        </span>
                        &nbsp;
                    </p>

                    <div className="flex flex-col grow sm:rounded-2xl">
                        <div className="my-2 flex justify-center">
                            <div className="w-full max-w-4xl">
                                <SearchInput 
                                    value={inputValue} 
                                    onChange={setInputValue} 
                                    onSearch={setSearchQuery}
                                />
                                <p className="text-sm italic text-white mt-2 text-center">
                                    Examples: a guitar amp for a new band, a new student cafe to revive social life, compute resources for an AI experiment
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex gap-4 pt-8">
                <div className="w-64">
                    <Filter filterState={filterState} onFilterChange={setFilterState} />
                </div>
                <div className="flex-1">
                    <ResultView grants={eligibleGrants} searchQuery={searchQuery} />
                </div>
            </div>
        </main>
    );
}