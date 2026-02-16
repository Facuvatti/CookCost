import { useEffect, useState } from "react"
type UseEntityListOptions<T> = {
  fetchAll?: () => Promise<T[]>
  data?: T[]
}
export function useEntityList<T extends { id: number }>({ fetchAll, data }: UseEntityListOptions<T>) {
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);
	
	useEffect(() => {
		let alive = true;

		async function load() {
			let result = data;
			if(fetchAll && result == undefined) result = await fetchAll();
			if (alive) {
				if(result) setItems(result);
				setLoading(false);
			}
		}

		load();
		return () => {
			alive = false;
		}
	}, [fetchAll, data]);

	function updateItem(id: number, updated: T) {
		setItems(prev =>
			prev.map(i => i.id === id ? updated : i)
		);
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