/** YYYY-MM-DD of a Date using the visitor's local calendar day (what they clicked), not UTC. */
export const localDateKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
