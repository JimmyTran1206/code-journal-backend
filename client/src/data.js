let data = {
  entries: [],
  nextEntryId: 1,
};

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('code-journal-data', dataJSON);
});

const localData = JSON.parse(localStorage.getItem('code-journal-data'));
if (localData) {
  data = localData;
}

export function readEntries() {
  return data.entries;
}

export async function addEntry(entry) {
  // entry.entryId = data.nextEntryId++;
  // data.entries.unshift(entry);
  try {
    const reqMethod = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    };
    const response = await fetch('/api/entries', reqMethod);
    if (!response.ok) {
      throw new Error(`fetching error status ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

export async function updateEntry(entry) {
  try {
    const reqMethod = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    };
    const response = await fetch(`/api/journals/${entry.entryId}`, reqMethod);
    if (!response.ok) {
      throw new Error(`fetching error status ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  // const newEntries = data.entries.map((e) =>
  //   e.entryId === entry.entryId ? entry : e
  // );
  // data.entries = newEntries;
}

export function removeEntry(entryId) {
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
}
