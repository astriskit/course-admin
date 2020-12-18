import lowDb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { nanoid } from "nanoid";

const getDBHandle = (db) => {
  const adapter = new FileSync(`./db/${db}.json`);
  const dbHandle = lowDb(adapter);
  dbHandle.defaults({ data: [] }).write();
  return dbHandle;
};

const idLength = 8;

export class Model {
  constructor(db) {
    this.db = getDBHandle(db);
  }

  read(opts) {
    const {
      perPage = "",
      page = "",
      filter: { key, value } = { key: "", value: "" },
      sort: { by: sortBy, order = "desc" } = { by: "", order: "" },
    } = opts || {};

    console.log(key, value);

    let data = this.db.get("data");
    if (key && value) {
      data = data.filter([key, value]);
      console.log("data", data.value());
    }
    if (sortBy && order) {
      data = data.orderBy(sortBy, order);
    }
    if (perPage && page) {
      data = data.takeWhile((_, index) => {
        const tillIndex = page * perPage;
        let firstIndex = tillIndex - perPage + 1;
        firstIndex = firstIndex < 0 ? 0 : firstIndex;
        return index >= firstIndex && index <= tillIndex;
      });
    }
    return data.value();
  }

  add(data) {
    const id = nanoid(idLength);
    this.db
      .get("data")
      .push({ id, ...data })
      .write();
    return this.db.get("data").find({ id }).value();
  }

  update(dataId, newData) {
    this.db
      .get("data")
      .find({ id: dataId })
      .assign({ id: dataId, ...newData })
      .write();
    return this.db.get("data").find({ id: dataId }).value();
  }

  delete(dataId) {
    this.db.get("data").remove({ id: dataId }).write();
  }
}
