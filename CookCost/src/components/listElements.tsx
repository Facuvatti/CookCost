type api<T> = {
  create: (item: T) => Promise<unknown>
  update: (id: number, changes: T) => Promise<unknown>
  delete: (id: number) => Promise<unknown>
}
type ListElementsProps<T extends { id: number }> = {
  elements: T[]
  setElements: React.Dispatch<React.SetStateAction<T[]>>
  renderElement: (
    element: T,
    onCreate: (item: T) => void,
    onUpdate: (id: number, item: T) => void,
    onDelete: (id: number) => void
  ) => React.ReactNode
  api: api<T>
}

const ListElements = <T extends { id: number },>(
  props: ListElementsProps<T>
) => {
  const { elements, setElements, renderElement, api } = props

  function handleUpdate(id: number,updated: T) {
    setElements(prev =>
      prev.map(e => e.id === id ? updated : e)
    )
    api.update?.(id, updated)
  }
  function handleCreate(item: T) {
    setElements(prev => [...prev, item])
    api.create?.(item)
  }
  function handleDelete(id: number) {
    setElements(prev =>
      prev.filter(e => e.id !== id)
    )
    api.delete?.(id)
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
