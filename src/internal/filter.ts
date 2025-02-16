import { FilterState, Grant, SortBy, SortOrder } from "@/internal/types";

export function filterGrants(
    grants: Grant[],
    filterState: FilterState
) : Grant[] {
    let pred = (grant: Grant) => {
        console.log("Filtering grant");
        if(filterState.minAmount !== null) {
            let grantMax = grant.amountMax;
            if(grantMax !== null) {
                if(grantMax < filterState.minAmount) {
                    return false;
                }
            }
        }
        if(filterState.positions && filterState.positions.length > 0) {
            // Check if any eligibility string contains any of the selected positions
            if(!filterState.positions.some(position => 
                grant.eligibility.some(e => e.includes(position))
            )) {
                return false;
            }
        }
        if(filterState.representingVSOs && filterState.representingVSOs.length > 0) {
            // Check if any eligibility string contains any of the selected VSOs
            // Skip 'None' checks
            const relevantVSOs = filterState.representingVSOs.filter(vso => vso !== 'None');
            if(relevantVSOs.length > 0 && !relevantVSOs.some(vso => 
                grant.eligibility.some(e => e.includes(vso))
            )) {
                return false;
            }
        }
        return true;
    }
    return grants.filter(pred);
}

export function sortGrants(
    grants: Grant[],
    filterState: FilterState
) : Grant[] {
    // SORT BEHAVIOUR:
    //  if A has no amountMax, it is treated as higher than any grant that has an amountMax

    // -1 if a<b , 0 if a=b, +1 if a>b
    function partiallyOrderedGreater(a: Grant, b: Grant) {
        let byAmount = filterState.sortBy == SortBy.Enum.Amount;
        if(byAmount) {
            let a_prop = a.amountMax
            let b_prop = b.amountMax
            if(a_prop === null && b_prop === null) {
                return 0
            } else if(a_prop === null || b_prop === null) {
                return a_prop === null ? 1 : -1
            }
            return (a_prop < b_prop) ? -1
                : ((a_prop == b_prop) ? 0 : 1)
        } else {
            return (a.deadline < b.deadline) ? -1
                : ((a.deadline == b.deadline) ? 0 : 1)
        }
    }
    let compare;
    if(filterState.sortOrder == SortOrder.Enum.Descending) {
        compare = partiallyOrderedGreater;
    } else {
        compare = (a: Grant, b: Grant) => -partiallyOrderedGreater(a, b)
    }
    return grants.toSorted(compare);
}