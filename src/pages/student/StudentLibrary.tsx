import { useState } from 'react';
import { Book, Search, Clock, BookOpen, Star } from 'lucide-react';

export default function StudentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{ [key: string]: 'pending' | 'success' | 'error' }>({});

  const libraryStats = {
    booksIssued: 3,
    booksReturned: 12,
    fine: 0,
    availableBooks: 5000,
  };

  const issuedBooks = [
    {
      id: 'BK001',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      issueDate: '2025-09-15',
      dueDate: '2025-10-15',
      status: 'Issued',
      fine: 0,
    },
    {
      id: 'BK002',
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz',
      issueDate: '2025-09-20',
      dueDate: '2025-10-20',
      status: 'Issued',
      fine: 0,
    },
    {
      id: 'BK003',
      title: 'Operating System Concepts',
      author: 'Abraham Silberschatz',
      issueDate: '2025-08-25',
      dueDate: '2025-09-25',
      status: 'Overdue',
      fine: 50,
    },
  ];

  const recommendedBooks = [
    { title: 'Clean Code', author: 'Robert C. Martin', available: 5, rating: 4.8 },
    { title: 'Design Patterns', author: 'Gang of Four', available: 3, rating: 4.7 },
    { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', available: 4, rating: 4.9 },
  ];

  // Complete library database for search
  const libraryDatabase = [
    { id: 'BK101', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', available: 3, category: 'Computer Science' },
    { id: 'BK102', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', available: 5, category: 'Programming' },
    { id: 'BK103', title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', available: 3, category: 'Software Engineering' },
    { id: 'BK104', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', available: 4, category: 'Programming' },
    { id: 'BK105', title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', available: 2, category: 'Database' },
    { id: 'BK106', title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1118063330', available: 0, category: 'Operating Systems' },
    { id: 'BK107', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', available: 6, category: 'Networking' },
    { id: 'BK108', title: 'Artificial Intelligence', author: 'Stuart Russell', isbn: '978-0136042594', available: 4, category: 'AI' },
    { id: 'BK109', title: 'Machine Learning', author: 'Tom Mitchell', isbn: '978-0070428072', available: 2, category: 'Machine Learning' },
    { id: 'BK110', title: 'Data Structures in C', author: 'Reema Thareja', isbn: '978-0198099307', available: 5, category: 'Data Structures' },
  ];

  // Search function
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setShowResults(false);
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = libraryDatabase.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query) ||
        book.category.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setShowResults(true);
  };

  // Request book function
  const handleRequestBook = (bookId: string, bookTitle: string) => {
    const book = libraryDatabase.find(b => b.id === bookId) || 
                 searchResults.find(b => b.id === bookId);

    if (book && book.available === 0) {
      setRequestStatus({ ...requestStatus, [bookId]: 'error' });
      setTimeout(() => {
        setRequestStatus({ ...requestStatus, [bookId]: undefined as any });
      }, 3000);
      return;
    }

    // Simulate request processing
    setRequestStatus({ ...requestStatus, [bookId]: 'pending' });
    
    setTimeout(() => {
      setRequestStatus({ ...requestStatus, [bookId]: 'success' });
      alert(`Book request submitted successfully!\n\nBook: ${bookTitle}\nRequest ID: REQ${Date.now()}\n\nYou will be notified once the book is ready for pickup.`);
      
      setTimeout(() => {
        setRequestStatus({ ...requestStatus, [bookId]: undefined as any });
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Library</h1>
        <p className="text-gray-600 mt-1">Manage your issued books and explore library resources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Books Issued</h3>
            <BookOpen className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-blue-600">{libraryStats.booksIssued}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Books Returned</h3>
            <Book className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-600">{libraryStats.booksReturned}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pending Fine</h3>
            <Clock className="text-red-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-red-600">₹{libraryStats.fine}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Available Books</h3>
            <Book className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-purple-600">{libraryStats.availableBooks}+</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Books</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by title, author, ISBN, or category..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Search Results ({searchResults.length} books found)
            </h3>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((book) => (
                  <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{book.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                        <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {book.category}
                        </span>
                      </div>
                      <Book className="text-blue-600 flex-shrink-0" size={32} />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className={`text-sm font-semibold ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available > 0 ? `${book.available} available` : 'Not available'}
                      </span>
                      <button
                        onClick={() => handleRequestBook(book.id, book.title)}
                        disabled={requestStatus[book.id] === 'pending'}
                        className={`px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${
                          book.available === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : requestStatus[book.id] === 'success'
                            ? 'bg-green-600 text-white'
                            : requestStatus[book.id] === 'error'
                            ? 'bg-red-600 text-white'
                            : requestStatus[book.id] === 'pending'
                            ? 'bg-blue-400 text-white cursor-wait'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {requestStatus[book.id] === 'success'
                          ? '✓ Requested'
                          : requestStatus[book.id] === 'error'
                          ? 'Unavailable'
                          : requestStatus[book.id] === 'pending'
                          ? 'Processing...'
                          : 'Request'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Book className="mx-auto mb-3 text-gray-400" size={48} />
                <p>No books found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issued Books */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Issued Books</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Issue Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issuedBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{book.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{book.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{book.author}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{book.issueDate}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{book.dueDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        book.status === 'Issued' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-semibold text-red-600">
                    {book.fine > 0 ? `₹${book.fine}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Books */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedBooks.map((book, index) => {
            const bookData = libraryDatabase.find(b => b.title === book.title);
            const bookId = bookData?.id || `REC${index}`;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <Book className="text-blue-600" size={32} />
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-semibold text-gray-700">{book.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.available > 0 ? `${book.available} available` : 'Not available'}
                  </span>
                  <button
                    onClick={() => handleRequestBook(bookId, book.title)}
                    disabled={book.available === 0 || requestStatus[bookId] === 'pending'}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors font-semibold ${
                      book.available === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : requestStatus[bookId] === 'success'
                        ? 'bg-green-600 text-white'
                        : requestStatus[bookId] === 'pending'
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {requestStatus[bookId] === 'success'
                      ? '✓ Requested'
                      : requestStatus[bookId] === 'pending'
                      ? 'Processing...'
                      : 'Request'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
