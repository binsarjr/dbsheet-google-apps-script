interface FieldCoreOperation {
  like: string
  ilike: string
  equal: string | number
  greaterThan: string | number
  greaterThanOrEqual: string | number
  lessThan: string | number
  lessThanOrEqual: string | number
  in: string[]
}
type FieldOperation = Partial<
  FieldCoreOperation & { not: Partial<FieldCoreOperation> }
>

interface CoreOperation {
  $limit: number
}

type Operation = Partial<
  { [key: string]: FieldOperation | string | number } & CoreOperation
>
