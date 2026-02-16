import type { WithoutId } from "../types/shared"

type api<T> = {
  create: (item: WithoutId<T>, id?: number) => Promise<unknown>
  update: (changes: T) => Promise<unknown>
  del: (id: number) => Promise<unknown>
}
type ListElementsProps<T extends { id: number }> = {
  elements: T[]
  setElements: React.Dispatch<React.SetStateAction<T[]>>
  renderElement: (
    element: T,
    onCreate: (item: WithoutId<T>) => void,
    onUpdate: (item: T) => void,
    onDelete: (id: number) => void
  ) => React.ReactNode
  api: api<T>
}

const ListElements = <T extends { id: number },>(
  props: ListElementsProps<T>
) => {
  const { elements, setElements, renderElement, api } = props

  function handleUpdate(updated: T) {
    setElements(prev =>
      prev.map(e => e.id === updated.id ? updated : e)
    )
    api.update?.(updated)
  }
  function handleCreate(item: WithoutId<T>, id?: number) {
    let result;
    if(id) result = api.create?.(item, id)
      else result = api.create?.(item)
    setElements(prev => [...prev, result as unknown as T])
  }
  function handleDelete(id: number) {
    setElements(prev =>
      prev.filter(e => e.id !== id)
    )
    api.del?.(id)
  }

  return (
    <>
      {elements.map(element =>
        renderElement(element, handleCreate ,handleUpdate, handleDelete)
      )}
    </>
  )
}

export default ListElements
