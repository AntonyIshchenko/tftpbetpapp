import Session from '../schemas/sessionModel.js';

const clearExpiredSessions = async () => {
  try {
    // first remove sessions with no exrires date
    let sessions = await Session.find({ expiresAt: null });
    if (sessions.length > 0) {
      await Session.deleteMany({ _id: sessions.map(s => s._id) });
    }

    // second remove sessions with exrired date
    sessions = await Session.find({
      expiresAt: { $lte: new Date() },
    });
    if (sessions.length > 0) {
      await Session.deleteMany({ _id: sessions.map(s => s._id) });
    }
  } catch (error) {
    // save error in application log
  }
};

export default clearExpiredSessions;
