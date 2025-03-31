import { Staff, columns } from "./columns"
import { DataTable } from "./data-table"


async function generateStaffRecords(): Promise<Staff[]> {
    const names = ["John Will", "Paul Gyimah", "Jeremy Agyei", "Michael Mensah", "Sarah Owusu"];
    const availabilityStatus = ["Available", "Unavailable"];

    const staffRecords: Staff[] = [];

    for (let i = 1; i <= 50; i++) {
        const randomName = names[i % names.length];
        const randomAvailability = availabilityStatus[i % availabilityStatus.length];
        const randomSales = (Math.random() * 10000).toFixed(2); // Sales in GHS
        const randomRating = (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0 and 5.0

        staffRecords.push({
            id: i,
            name: randomName,
            email: `${randomName.toLowerCase().replace(" ", "")}@mail.com`,
            phoneNumber: `05013297${(i % 10).toString().padStart(2, "0")}`,
            rating: parseFloat(randomRating),
            sales: parseFloat(randomSales),
            availability: randomAvailability as "Available" | "Unavailable",
        });
    }

    return staffRecords;
}

console.log(generateStaffRecords());


export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const data = await generateStaffRecords()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}