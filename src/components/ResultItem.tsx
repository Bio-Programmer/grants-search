import { Grant } from '@/internal/types';

export function GrantAsListItem(grant: Readonly<Grant>) : React.ReactElement {
    return (
        <li className={"w-full p-4 flex flex-col md:flex-row border border-sky-400"}>
            <div className={"w-auto"}>
                <h3 className={"text-2xl"}>{ grant.title }</h3>
                <p><b className={"mr-3"}>Description</b>{ grant.description }</p>
                {/* <p><b className={"mr-3"}>Amount</b>{ item.minAmount }-{ item.amount}</p> */}
            </div>
        </li>
    )
}