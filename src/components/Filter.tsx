import { AcademicPosition, FilterState, RepresentingVSO } from "@/internal/types";

interface FilterProps {
    filterState: FilterState;
    onFilterChange: (newState: FilterState) => void;
}

export function Filter({ filterState, onFilterChange }: FilterProps): React.ReactElement {
    const handlePositionChange = (position: AcademicPosition.Type) => {
        const newPositions = filterState.positions.includes(position)
            ? filterState.positions.filter(p => p !== position)  // remove if already selected
            : [...filterState.positions, position];  // add if not selected
            
        onFilterChange({
            ...filterState,
            positions: newPositions
        });
    };

    const handleVSOChange = (vso: RepresentingVSO.Type) => {
        const newVSOs = filterState.representingVSOs.includes(vso)
            ? filterState.representingVSOs.filter(v => v !== vso)  // remove if already selected
            : [...filterState.representingVSOs, vso];  // add if not selected
            
        onFilterChange({
            ...filterState,
            representingVSOs: newVSOs
        });
    };

    return (
        <div className="pl-8">
            <div className="space-y-4 p-4 bg-white rounded-lg shadow">
                <div>
                    <h3 className="font-semibold mb-2">Academic Position</h3>
                    <div className="space-y-2">
                        {AcademicPosition.values.map(position => (
                            <label key={position} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filterState.positions.includes(position)}
                                    onChange={() => handlePositionChange(position)}
                                    className="rounded border-gray-600"
                                />
                                <span>{position}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">VSO</h3>
                    <div className="space-y-2">
                        {RepresentingVSO.values.map(vso => (
                            <label key={vso} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filterState.representingVSOs.includes(vso)}
                                    onChange={() => handleVSOChange(vso)}
                                    className="rounded border-gray-300"
                                />
                                <span>{vso}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}