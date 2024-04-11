import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-vfK6v79AqhczxkmDDaiDaUocqja4JQI",
  authDomain: "yj4-next-blog-test.firebaseapp.com",
  projectId: "yj4-next-blog-test",
  storageBucket: "yj4-next-blog-test.appspot.com",
  messagingSenderId: "484342480470",
  appId: "1:484342480470:web:ad845a73a892af385e85f7",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
