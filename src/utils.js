export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
export const convertPrice = (price) => {
  try {
    const result = price?.toLocaleString().replaceAll(",", ".");
    return `${result}₫`;
  } catch (error) {
    return null;
  }
};
export const renderOptionsType = (arr) => {
  let results = [];
  if (arr) {
    results = arr?.map((opt) => {
      return {
        value: opt,
        lable: opt,
      };
    });
  }
  results.push({
    label: "Thêm loại mới",
    value: "add_type",
  });
  return results;
};
export const renderOptionsCate = (arr) => {
  let results = [];
  if (arr) {
    results = arr.map((opt) => {
      return {
        value: opt._id,
        label: opt.nameCate,
      };
    });
  }
  return results;
};
