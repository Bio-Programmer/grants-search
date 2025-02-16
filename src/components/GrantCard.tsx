import { Grant } from '@/internal/types';

interface GrantCardProps {
    grant: Grant;
}

export function GrantCard({ grant }: GrantCardProps): React.ReactElement {
    // Format the deadline date
    const formatDeadline = (deadline: string | Date) => {
        if (!deadline) return 'No deadline set';
        const date = deadline instanceof Date ? deadline : new Date(deadline);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getDaysLeft = (deadline: string | Date) => {
        console.log('Deadline received:', deadline);
        if (!deadline) {
            console.log('No deadline provided');
            return null;
        }
        const today = new Date();
        const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const result = diffDays > 0 ? diffDays : null;
        return result;
    };

    const createGoogleCalendarUrl = (grant: Grant) => {
        const deadline = new Date(grant.deadline);
        const endDate = new Date(deadline);
        endDate.setDate(deadline.getDate() + 1); // End date is next day for all-day event

        const formatDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d{3}/g, '');
        };

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: `DUE: ${grant.title}`,
            dates: `${formatDate(deadline)}/${formatDate(endDate)}`,
            details: 'Grant deadline'
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const handleAddToCalendar = () => {
        const calendarUrl = createGoogleCalendarUrl(grant);
        window.open(calendarUrl, '_blank');
    };

    const daysLeft = getDaysLeft(grant.deadline);

    // Format amount range
    const formatAmount = () => {
        if (!grant.amountMin || !grant.amountMax || grant.amountMin === -1 || grant.amountMax === -1) return 'Amount varies';
        if (grant.amountMin === grant.amountMax) {
            return `$${grant.amountMin.toLocaleString()}`;
        }
        return `$${grant.amountMin.toLocaleString()} - $${grant.amountMax.toLocaleString()}`;
    };

    return (
        <div className="rounded-3xl bg-white border-2 border-cardinal-red-dark p-6 text-black-900 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-black-900">{grant.title}</h2>
                <div className="text-right">
                    <div className="font-bold text-cardinal-red-dark bg-black-25 px-3 py-1 rounded-lg inline-block">
                        Due: {formatDeadline(grant.deadline)}
                    </div>
                    {daysLeft && (
                        <div className="font-bold text-cardinal-red-dark mt-1">{daysLeft} Days Left</div>
                    )}
                </div>
            </div>
            
            <div className="mt-2">
                <span className="font-medium text-black-900">Eligibility: </span>
                {grant.eligibility.join(', ')}
            </div>
            
            <div className="mt-2">
                <span className="font-medium text-black-900">Amount: </span>
                {formatAmount()}
            </div>
            
            <div className="mt-2">
                <span className="font-medium text-black-1000 text-sm">Description: </span>
                <span className="text-sm">{grant.description}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4">
                {grant.url ? (
                    <a 
                        href={grant.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-cardinal-red-dark hover:text-cardinal-red hover:font-bold transition-all duration-150"
                    >
                        Apply →
                    </a>
                ) : (
                    <span className="text-black-400">Application not yet open</span>
                )}
                
                {grant.deadline && (
                    <button 
                        className="text-cardinal-red-dark hover:text-cardinal-red hover:font-bold transition-all duration-150"
                        onClick={handleAddToCalendar}
                    >
                        Add to calendar ↗
                    </button>
                )}
            </div>
        </div>
    );
}