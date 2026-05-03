const calculateTrustScore = ({ transactions = 0, rating = 0, verified = false }) => {
  return transactions * 10 + rating * 10 + (verified ? 20 : 0);
};

module.exports = calculateTrustScore;
