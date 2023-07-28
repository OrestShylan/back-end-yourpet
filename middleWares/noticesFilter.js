const noticesFilter = async (req, res, next) => {
  const { gender } = req.query;
  const query = {};
  if (!gender) {
    next();
    return;
  }

  if (gender) {
    query.sex = gender.toLowerCase();
  }

  req.searchQuery = query;
  next();
};

module.exports = noticesFilter;
