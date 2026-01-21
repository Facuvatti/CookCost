type ListElementsProps<T extends { id: number }> = {
  elements: T[]
  setElements: React.Dispatch<React.SetStateAction<T[]>>
  renderElement: (
    element: T,
    onUpdate: (e: T) => void,
    onDelete: (id: number) => void
  ) => React.ReactNode
  onDeleteApi?: (id: number) => void
}

const ListElements = <T extends { id: number },>(
  props: ListElementsProps<T>
) => {
  const { elements, setElements, renderElement, onDeleteApi } = props

  function handleUpdate(updated: T) {
    setElements(prev =>
      prev.map(e => e.id === updated.id ? updated : e)
    )
  }

  function handleDelete(id: number) {
    setElements(prev =>
      prev.filter(e => e.id !== id)
    )
    onDeleteApi?.(id)
  }

  return (
    <>
      {elements.map(element =>
        renderElement(element, handleUpdate, handleDelete)
      )}
    </>
  )
}

export default ListElements
