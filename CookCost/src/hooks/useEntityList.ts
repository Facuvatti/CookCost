import { useEffect, useState } from "react"
type UseEntityListOptions<T> = {
  fetchAll: () => Promise<T[]>
}
export function useEntityList<T extends { id: number }>({ fetchAll }: UseEntityListOptions<T>) {
	const [items, setItems] = useState<T[]>([])
	const [loading, setLoading] = useState(true)
	const [isAdding, setIsAdding] = useState(false)

	useEffect(() => {
		let alive = true

		async function load() {
			const data = await fetchAll()
			if (alive) {
			setItems(data)
			setLoading(false)
			}
		}

		load()
		return () => {
			alive = false
		}
	}, [fetchAll])

	function updateItem(id: number, updated: T) {
		setItems(prev =>
			prev.map(i => i.id === id ? updated : i)
		)
	}

	return {
		items,
		setItems,
		loading,
		isAdding,
		setIsAdding,
		updateItem
	}
}

export default useEntityList