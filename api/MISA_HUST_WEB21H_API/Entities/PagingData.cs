namespace MISA_HUST_WEB21H_API.Entities
{
    /// <summary>
    /// Dữ liệu trả về từ API lọc và phân trang
    /// </summary>
    public class PagingData
    {
        /// <summary>
        /// Danh sách nhân viên thỏa mãn điều kiện
        /// </summary>
        public List<object> Data { get; set; }

        /// <summary>
        /// Tổng số bản ghi thỏa mãn
        /// </summary>
        public int TotalCount { get; set; }
    }
}
