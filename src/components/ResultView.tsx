import { Grant } from "@/internal/types";
import { GrantCard } from '@/components/GrantCard';
import { useMemo, useEffect, useState } from 'react';
import { getSimilarGrants } from '@/utils/similarity';

interface ResultViewProps {
    grants: Grant[];
    searchQuery?: string;
}

export function ResultView({ grants, searchQuery = "" }: ResultViewProps): React.ReactElement {
    const [similarGrantIds, setSimilarGrantIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchSimilarGrants = async () => {
            if (searchQuery.trim()) {
                const ids = await getSimilarGrants(searchQuery);
                console.log('Received similar grant IDs:', ids);
                setSimilarGrantIds(ids);
            } else {
                setSimilarGrantIds([]);
            }
        };

        fetchSimilarGrants();
    }, [searchQuery]);

    const sortedAndFilteredGrants = useMemo(() => {
        if (!searchQuery.trim()) {
            // If no search query, sort by deadline as before
            return grants.sort((a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            });
        }

        // Create a map for O(1) lookup of grant ids
        const grantMap = new Map(grants.map(grant => [grant.id, grant]));
        
        // Return grants in the order of similarGrantIds
        return similarGrantIds
            .map(id => grantMap.get(id))
            .filter((grant): grant is Grant => grant !== undefined); // Type guard to remove undefined grants
    }, [grants, searchQuery, similarGrantIds]);

    return (
        <div className="container mx-auto px-8 pr-12">
            {sortedAndFilteredGrants.length === 0 ? (
                <div className="text-center text-gray-500">
                    No grants found matching your criteria :(
                </div>
            ) : (
                <ul className="space-y-4">
                    {sortedAndFilteredGrants.map((grant) => (
                        <li key={grant.title}>
                            <GrantCard grant={grant} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}