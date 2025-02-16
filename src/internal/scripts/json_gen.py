from openai import OpenAI
import datetime

def main():
    client = OpenAI()
    today_date = datetime.date.today()

    text = """
    ngagement Mini-Grants Info Sheet

    Why Student Campus Engagement Mini-Grants?

    The Office of Community Engagement is excited to announce the 2023-24 campus engagement mini-grants! These mini-grants foster creative ideas for new, exciting, and/or meaningful ways to connect and engage with one another. 

    Your ideas-come-to-life build community and contribute to a vibrant campus life, providing opportunities for students to form new connections with people, places, and perspectives.
    
    We encourage all students with ideas and the motivation to make them happen to apply!



    Guidelines:

    About
    For student-led engagement activities in the 2023-24 academic year
    Intended to support broad-based engagement activities open to the entire student community that activate and enliven campus spaces, create excitement, and engage the community



    Funding
    Maximum $2,000 grant
    Organizers may receive mini-grant funding support once for the year. New applications and applicants will be prioritized
    Funds are available to all students (including those not acting on behalf of or affiliated with a VSO)
    Funding uses include, for example:
    Honorariums (fees payable to speakers, teachers, instructors)
    Event Services orders
    Vendor invoices
    Event supplies/rentals
    Food/Catering
    Funding will not support:
    Alcohol
    Purchasing of equipment or products that could otherwise be rented
    T-shirts or giveaways (if only for an organization and unrelated to the event)
    Donations or gifts to groups, organizations, or individuals
    Reimbursements for personally paid expenses
    Staff or student salaries
    Mini-grant recipients will work with staff members from either Campus Engagement and/or the Office of Student Engagement to reserve venues, handle contracts, pay invoices, make purchases, etc.
    Funding will be prioritized for novel engagement activities and/or those that would otherwise not be possible without mini-grant support
    Mini-grants do not retroactively fund engagement activities. Engagement activities with a target date before the decision funding week will not be eligible to receive funding


    Planning
    Location:
    Intended for in-person engagement activities on the Stanford campus. 
    Not intended for fully remote or off-campus engagement activities.
    Scope:
    Applicants are encouraged to submit engagement activities that engage the broader student community
    Engagement activities cannot be club/group exclusive
    Event Organizing:
    Event planners must adhere to the event planning policies/guidelines 
    Students whose applications are approved will be the primary engagement activity organizers and will work with staff from Campus Engagement and/or the Office of Student Engagement to plan and carry out the event for which funding was granted
    ‘Independent’ applicants are strongly encouraged to have at least three co-organizers
    Timing:
    Engagement activities are to occur within the quarter designated by the application cycle (e.g. “Fall Quarter applications,” etc.)


    Application & Review Process
    Before applying, please review these guidelines and the application questions carefully 
    Application Cycles
    For Spring Quarter Engagement Activities:
    Application open February 5, 2024 – February 18, 2024
    Decisions announced week of Feb. 26
    Applications are open until 11:59 p.m. on the final day of the cycle
    The review committee will not consider partially completed applications or those missing required information. You are encouraged to apply in the next cycle, with a full and complete application.
    All decisions are final.



    To apply, visit:
    bit.ly/student-minigrant-app 



    Questions? 
    Email campusengagement@stanford.edu

    """


    system_prompt = f"""
    Using the entered information, populate this json element:
        "title": string,
        "description": string,
        "eligibility": Subset of ["Undergraduate", "Masters Student", "Coterm", "PhD", "Postdoc", "Faculty", "Undergraduate VSO", "Graduate VSO""Other"],
        "amountMin": Int,
        "amountMax": Int,
        "url": string,
        "deadline": string,
        "nextCycleStartDate": string,
    "description" should be copy-pasted sentences from the original description.
    "VSO" in the "eligibility" field is a student group. Any offerings for a student group should include "VSO" as eligible.
    "Coterm" is a 5 year master's program. All coterm students are Master's students and can qualify for Graduate funding.
    "deadline" and "nextCycleStartDate" should be in ISO 8601 format, and assume 11:59PM PT if the deadline time is not listed.
    "deadline" should be an empty string if the deadline has passed for this cycle. The deadline has passed if it's before our current date, {today_date}.
    If today's date is {today_date}, and the deadline was Dec 2023, "deadline" = "" (empty string).
    "nextCycleStartDate" is the anticipated next start date, and if only a deadline is given, the anticipated application open date should be 2 months before then. For example, "The application period closed on March 20, 2024" should translate to "nextCycleStartDate": "2023-01-20T00:00-08:00"
    If applications is due annually January, and today's date is April 5, 2024, "nextCycleStartDate" = "2025-01-01T00:00-08:00"
    """

    prompting = f"""
    Description:
    SERI 2024 Research Fellowship Application
    In summer 2024, the Stanford Existential Risks Initiative will fund 10-week full-time research projects dedicated to mitigating existential risks, with an emphasis on building a community of existential risk researchers via speaker events, discussion groups, social events, etc. Students will work with a mentor (a faculty member, postdoctoral scholar, or industry expert), who will provide weekly advising along with guidance on projects and their design. 

    We define a existential risk as one that could cause the collapse of human civilization or even the extinction of the human species. Prominent examples of human-driven existential risks include 1) nuclear war, 2) an infectious disease pandemic engineered by malevolent actors using synthetic biology, 3) hostile or uncontrolled deployments of artificial intelligence, and 4) climate change and other environmental degradation creating biological and physical conditions that thriving human civilizations would not survive. Existential risks projects could range from purely technical research to philosophical research.

    The program will run for 10 weeks from 6/24/24 to 8/29/24, and is open to all current Stanford students (both undergraduate and graduate). Participants will be paid a research stipend of $7,500 for their work. To apply, please fill out the form below. Applications will be considered on a rolling basis until May 15th, 2024.

    Email seri-contact@stanford.edu with any additional questions. We look forward to reading your application!

    JSON:
    "title": "SERI 2024 Research Fellowship",
    "description": "In summer 2024, the Stanford Existential Risks Initiative will fund 10-week full-time research projects dedicated to mitigating existential risks, with an emphasis on building a community of existential risk researchers via speaker events, discussion groups, social events, etc. Students will work with a mentor (a faculty member, postdoctoral scholar, or industry expert), who will provide weekly advising along with guidance on projects and their design. We define a existential risk as one that could cause the collapse of human civilization or even the extinction of the human species. Prominent examples of human-driven existential risks include 1) nuclear war, 2) an infectious disease pandemic engineered by malevolent actors using synthetic biology, 3) hostile or uncontrolled deployments of artificial intelligence, and 4) climate change and other environmental degradation creating biological and physical conditions that thriving human civilizations would not survive. Existential risks projects could range from purely technical research to philosophical research.",
    "eligibility": ["Undergraduate", "Masters Student", "Coterm", "PhD"],
    "amountMin": 7500,
    "amountMax": 7500,
    "url": "https://docs.google.com/forms/d/e/1FAIpQLScLRbrn89CLK5I0YY8vajVXgkYfNBhJB_hNi1QW0bokt2bQtg/viewform",
    "deadline": "2024-05-15T23:59:59-07:00",
    "nextCycleStartDate": "",

    Description: ANNOUNCEMENT: The Billie Achilles Fund will not be accepting applications at this time. The application will reopen at the end of May, 2024. 

    The Billie Achilles Fund — offered by Bechtel International Center — provides funding for student organizations to develop creative programming that brings people of different international backgrounds together to increase cultural awareness and understanding. To qualify for funding, your program/event must include an intercultural component.

    The fund is named after Billie Achilles, a longtime friend to international students at Stanford.

    Who Can Apply
    To be eligible for funds, your organization must be a registered Stanford student organization with an international focus

    Additionally, your event must be free and open to the entire Stanford community.

    The fund does not support:

    Events primarily social in nature (e.g., parties or student group planning meetings)
    The purchase of alcohol
    Funding Limits
    Your organizations may apply for up to $1000 per event, not to exceed $2000 per group per academic year (while funds remain). Events not taking place at the Bechtel International Center cannot receive more than $500 per event.

    See Additional Requirements below for requirements regarding funding attribution in all event advertising and promotion.

    Funding Timeline
    Funds will be transferred within 4 weeks of the applications approval. Please keep this timeline in mind when applying for Achilles funding. 

    How to Apply
    To allow sufficient time for funding approvals and fund transfers to your organization, you should submit your funding application at least eight weeks prior to your event. We accept funding applications throughout the year (but do not review applications over Stanford’s Winter Closure).

    To make a funding request, complete and submit a Billie Achilles Fund Request.

    JSON:
    "title": "The Billie Achilles Fund",
    "description": "The Billie Achilles Fund — offered by Bechtel International Center — provides funding for student organizations to develop creative programming that brings people of different international backgrounds together to increase cultural awareness and understanding. To qualify for funding, your program/event must include an intercultural component. To be eligible for funds, your organization must be a registered Stanford student organization with an international focus. Additionally, your event must be free and open to the entire Stanford community. Your organizations may apply for up to $1000 per event, not to exceed $2000 per group per academic year (while funds remain). Events not taking place at the Bechtel International Center cannot receive more than $500 per event.",
    "eligibility": ["VSO"],
    "amountMin": 500,
    "amountMax": 1000,
    "url": "",
    "deadline": "",
    "nextCycleStart": "2024-05-31T00:00-08:00",

    Description: {text}

    JSON:
    """


    text = text.replace("\n", " ")
    completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompting}
            ],
        model="gpt-4-turbo-preview", 
    )
    print(completion.choices[0].message.content)


if __name__ == '__main__':
    main()