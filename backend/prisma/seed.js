const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hostel.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: adminPassword,
      role: 'admin',
      phone: '1234567890',
    },
  });

  // Create warden user
  const wardenPassword = await bcrypt.hash('warden123', 10);
  const warden = await prisma.user.upsert({
    where: { email: 'warden@hostel.com' },
    update: {},
    create: {
      name: 'Warden User',
      email: 'warden@hostel.com',
      password: wardenPassword,
      role: 'warden',
      phone: '1234567891',
    },
  });

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 10);
  const students = [];
  
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@hostel.com` },
      update: {},
      create: {
        name: `Student ${i}`,
        email: `student${i}@hostel.com`,
        password: studentPassword,
        role: 'student',
        phone: `12345678${90 + i}`,
      },
    });
    students.push(student);
  }

  // Create rooms
  const rooms = [];
  for (let floor = 1; floor <= 3; floor++) {
    for (let roomNum = 1; roomNum <= 10; roomNum++) {
      const roomNumber = `${floor}${String(roomNum).padStart(2, '0')}`;
      const type = roomNum % 2 === 0 ? 'AC' : 'Non-AC';
      const capacity = roomNum <= 5 ? 2 : 3;

      const room = await prisma.room.upsert({
        where: { roomNumber },
        update: {},
        create: {
          roomNumber,
          type,
          capacity,
          floor,
          occupied: 0,
        },
      });
      rooms.push(room);
    }
  }

  // Create student records and allocate rooms
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const room = rooms[i % rooms.length];

    await prisma.student.upsert({
      where: { userId: student.id },
      update: {},
      create: {
        userId: student.id,
        roomId: room.id,
        status: 'active',
      },
    });

    // Update room occupied count
    await prisma.room.update({
      where: { id: room.id },
      data: { occupied: { increment: 1 } },
    });
  }

  // Create some complaints
  const complaintCategories = ['electricity', 'water', 'cleaning'];
  for (let i = 0; i < 5; i++) {
    await prisma.complaint.create({
      data: {
        userId: students[i].id,
        title: `Complaint ${i + 1}`,
        description: `This is a sample complaint description ${i + 1}`,
        category: complaintCategories[i % complaintCategories.length],
        status: i < 2 ? 'pending' : 'resolved',
      },
    });
  }

  // Create some attendance records
  const studentRecords = await prisma.student.findMany();
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const student of studentRecords.slice(0, 5)) {
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status: Math.random() > 0.2 ? 'present' : 'absent',
        },
      });
    }
  }

  console.log('Seeding completed!');
  console.log('Admin credentials: admin@hostel.com / admin123');
  console.log('Warden credentials: warden@hostel.com / warden123');
  console.log('Student credentials: student1@hostel.com / student123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

