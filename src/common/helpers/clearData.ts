export async function clearData(): Promise<void> {
  if (window.electronAPI) {
    return window.electronAPI.clearData();
  }

  localStorage.clear();
  sessionStorage.clear();

  // Clear indexedDBs
  const dbs = await indexedDB.databases();
  await Promise.all(
    dbs.map((db) => {
      return new Promise<void>((resolve, reject) => {
        if (!db.name) return resolve();
        const deleteRequest = indexedDB.deleteDatabase(db.name);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject();
      });
    }),
  );
}
