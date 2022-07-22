export class PriorityType {
    name?: string;
    code?: number;
}

export let _priority: PriorityType[] = Array(
    {name: 'کم', code: 0},
    {name: 'متوسط', code: 1},
    {name: 'زیاد', code: 2}
)
