export default (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Topic (arrays, dynamic_programming, trees_graphs, system_design)',
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Programming language (python, java)',
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
    solvedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    timestamps: true,
    tableName: 'sessions',
  });

  return Session;
};
