import bcrypt from 'bcrypt';

async function test() {
    const password = '123456';
    const hash = await bcrypt.hash(password, 10);
    console.log('كلمة المرور المشفرة:', hash);
    
    const isValid = await bcrypt.compare(password, hash);
    console.log('التحقق صحيح:', isValid);
}

test();