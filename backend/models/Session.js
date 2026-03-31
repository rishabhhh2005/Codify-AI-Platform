export default (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Topic (arrays, dynamic_programming, trees_graphs, system_design)',
    },
    difficulty: {
      type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Programming language (javascript, python, java, cpp, etc)',
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Final score from AI evaluation (0-100)',
    },
    hintsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      defaultValue: 'active',
    },
    problemStatement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'sessions',
  });

  return Session;
};
