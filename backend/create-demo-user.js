const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

(async () => {
  await connectDB();

  const email = 'demo@wolfinic.com';
  const phone = '9999999999';
  const password = 'demo1234';

  let user = await User.findOne({ $or: [{ email }, { phone }] });
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email,
      phone,
      password,
      role: 'customer'
    });
    user.referralCode = user.generateReferralCode();
    await user.save();
    console.log(JSON.stringify({ created: true, email, phone, password, role: user.role }));
  } else {
    console.log(JSON.stringify({ exists: true, email: user.email, phone: user.phone, password, role: user.role }));
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
