const installService = require('../services/install.service');

async function install(req, res, next) {
  try {
    const installMessage = await installService.install();

    res.status(installMessage.status).json({
      message: installMessage.message
    });

  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message
    });
  }
}

module.exports = { install };
