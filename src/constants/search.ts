export const FieldNames = {
    SEARCH_STRING: 'f-search',
    POSITION: 'f-ident',
    REPRESENTING_VSO: 'f-repr-vso',
    FILTER_MIN_AMOUNT: 'f-filter-min-amount',
    MIN_AMOUNT: 'f-min-amount',
    SORT_BY: 'f-sort-by',
    SORT_ORDER: 'f-sort-order'
}

export const Limits = {
    MAX_SEARCH_LENGTH: 256,
    // empirical testing indicates that we can stuff about 40k embeddings in <200MB
    MAX_PERSISTENT_EMBEDDING_CACHE: 40000,
    MAX_TRANSIENT_EMBEDDING_CACHE: 40000,
}