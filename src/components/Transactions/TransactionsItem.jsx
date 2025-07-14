import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransactionThunk, fetchStatistics } from "../../redux/transactionsOperations";
import "./TransactionsItem.css";

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.013 2.013a1.375 1.375 0 0 1 1.944 1.944l-7.2 7.2-2.163.219a.5.5 0 0 1-.548-.548l.219-2.163 7.2-7.2Zm2.057-.057a2.375 2.375 0 0 0-3.357 0l-7.2 7.2A1 1 0 0 0 1.25 10.75l2.163-.219a1 1 0 0 0 .548-.274l7.2-7.2a2.375 2.375 0 0 0 0-3.357Z"
      fill="#BDBDBD"
    />
  </svg>
);

const TransactionsItem = ({ transaction, onEdit }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTransactionThunk(transaction.id)).unwrap();

        // transaction.date'den month ve year çıkar
        const date = transaction.date ? new Date(transaction.date) : new Date();
        const month = date.getMonth() + 1; // 1-12 arası
        const year = date.getFullYear();
       

        // İstatistikleri güncelle
        await dispatch(fetchStatistics({ month, year })).unwrap();
      } catch (error) {
        // Error handling - alert yerine console.error kullan
        console.error("Failed to delete transaction:", error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Tarih formatı: GG.AA.YY
  const formatDate = (dateString) => {
    const validDate = new Date(dateString);
    if (isNaN(validDate)) return "Invalid Date";
    return validDate.toLocaleDateString("en-GB").replace(/\//g, ".");
  };
  console.log("Rendered Transaction:", transaction);
  // Sadece + veya - işareti
  const getTypeSign = (type) => {
    const normalizedType = type?.toLowerCase();
    return normalizedType === "income" ? "+" : "-";
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(transaction);
    }
  };

  // Kategorileri Redux store'dan al
  const allCategories = useSelector((state) => state.transactions.categories);

  // Kategori adını ID'den bul
  const getCategory = (transaction) => {
    // Önce categoryName alanını kontrol et (eğer varsa)
    if (transaction.categoryName) {
      return transaction.categoryName;
    }

    // categoryId alanını kontrol et
    const categoryId = transaction.categoryId || transaction.category;
    
    if (!categoryId || !allCategories || allCategories.length === 0) {
      return "Loading...";
    }

    // Kategori ID'sini kullanarak kategori ismini bul
    const matched = allCategories.find((cat) => cat.id === categoryId);
    
    if (matched) {
      return matched.name;
    }

    // Eğer bulunamazsa ve category alanı UUID ise, "Unknown Category" döndür
    if (typeof categoryId === 'string' && categoryId.length > 20) {
      return "Unknown Category";
    }

    return categoryId || "Unknown";
  };

  // Yorum
  const getComment = (comment) => comment || "";

  // Tutar
  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`transaction-item ${transaction.type?.toLowerCase()}`}>
      <div className="transaction-date" data-label="Date: ">
        {formatDate(transaction.date)}
      </div>
      <div
        className={`transaction-type ${transaction.type?.toLowerCase()}`}
        data-label="Type: "
      >
        {getTypeSign(transaction.type)}
      </div>
      <div className="transaction-category" data-label="Category: ">
        {getCategory(transaction)}
      </div>
      <div className="transaction-description" data-label="Comment: ">
        {getComment(transaction.comment)}
      </div>
      <div className="transaction-amount" data-label="Sum: ">
        {formatAmount(transaction.amount)}
      </div>
      <div className="transaction-actions">
        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete transaction"
        >
          Delete
        </button>

        <button className="edit-icon-btn" onClick={handleEdit} title="Edit">
          <EditIcon />
        </button>
      </div>
    </div>
  );
};

export default TransactionsItem;
