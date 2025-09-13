import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const client = new MongoClient(process.env.MONGO_URL)
let db

async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db('aipma_db')
  }
  return db
}

// Datos de ejemplo para inicializar la base de datos
const datosDemostracion = {
  noticias: [
    {
      id: uuidv4(),
      titulo: "Nueva Iniciativa Global para la Ética Periodística",
      resumen: "AIPMA lanza un programa internacional para fortalecer los estándares éticos en el periodismo mundial.",
      contenido: "La Alianza Internacional de Periodismo y Medios Audiovisuales ha anunciado el lanzamiento de una nueva iniciativa global destinada a fortalecer los estándares éticos en el periodismo. Este programa incluirá talleres, certificaciones y recursos para periodistas de todo el mundo, con especial énfasis en la era digital y las nuevas tecnologías de comunicación.",
      categoria: "Ética",
      autor: "María González",
      fecha: new Date('2024-01-15'),
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      titulo: "Conferencia Internacional sobre Medios Audiovisuales 2024",
      resumen: "Se anuncia la fecha y ubicación de la conferencia anual más importante de medios audiovisuales.",
      contenido: "La conferencia internacional de medios audiovisuales 2024 se llevará a cabo en Barcelona, España, del 15 al 18 de marzo. Este evento reunirá a más de 500 profesionales de todo el mundo para discutir las últimas tendencias en producción audiovisual, streaming y nuevas tecnologías de media.",
      categoria: "Eventos",
      autor: "Carlos Rodríguez",
      fecha: new Date('2024-01-10'),
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      titulo: "Impacto de la Inteligencia Artificial en el Periodismo",
      resumen: "Análisis profundo sobre cómo la IA está transformando la profesión periodística.",
      contenido: "La inteligencia artificial está revolucionando el campo del periodismo, desde la automatización de noticias hasta la verificación de hechos. Este análisis examina tanto las oportunidades como los desafíos que presenta la IA para los profesionales de medios, incluyendo consideraciones éticas y el futuro del trabajo periodístico.",
      categoria: "Tecnología",
      autor: "Ana Martínez",
      fecha: new Date('2024-01-05'),
      fechaCreacion: new Date()
    }
  ],
  eventos: [
    {
      id: uuidv4(),
      titulo: "Cumbre Mundial de Periodismo Digital",
      descripcion: "Un encuentro global para explorar el futuro del periodismo en la era digital, con workshops prácticos y conferencias magistrales de expertos internacionales.",
      fecha: new Date('2024-03-20'),
      ubicacion: "Madrid, España",
      tipo: "conferencia",
      capacidad: 300,
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      titulo: "Taller de Verificación de Hechos",
      descripcion: "Seminario intensivo sobre técnicas avanzadas de fact-checking y herramientas digitales para la verificación de información en tiempo real.",
      fecha: new Date('2024-02-15'),
      ubicacion: "Online",
      tipo: "taller",
      capacidad: 100,
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      titulo: "Simposio de Ética en Medios Audiovisuales",
      descripcion: "Debate internacional sobre los dilemas éticos en la producción y distribución de contenido audiovisual en plataformas digitales.",
      fecha: new Date('2024-04-10'),
      ubicacion: "Buenos Aires, Argentina",
      tipo: "simposio",
      capacidad: 150,
      fechaCreacion: new Date()
    }
  ],
  miembros: [
    {
      id: uuidv4(),
      nombre: "Elena Vásquez",
      organizacion: "El Periódico Global",
      especialidad: "Periodismo Investigativo",
      pais: "España",
      tipo: "periodista",
      fechaIngreso: new Date('2022-01-15'),
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      nombre: "Roberto Silva",
      organizacion: "Media Latina Network",
      especialidad: "Producción Audiovisual",
      pais: "México",
      tipo: "productor",
      fechaIngreso: new Date('2021-09-10'),
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      nombre: "Sarah Johnson",
      organizacion: "International Press Alliance",
      especialidad: "Periodismo Digital",
      pais: "Estados Unidos",
      tipo: "editor",
      fechaIngreso: new Date('2023-03-20'),
      fechaCreacion: new Date()
    },
    {
      id: uuidv4(),
      nombre: "Jean-Pierre Martin",
      organizacion: "European Media Collective",
      especialidad: "Documentales",
      pais: "Francia",
      tipo: "director",
      fechaIngreso: new Date('2022-11-05'),
      fechaCreacion: new Date()
    }
  ]
}

async function inicializarDatos() {
  try {
    const database = await connectDB()
    
    // Verificar si ya existen datos
    const noticiasExistentes = await database.collection('noticias').countDocuments()
    if (noticiasExistentes === 0) {
      await database.collection('noticias').insertMany(datosDemostracion.noticias)
      console.log('Noticias de demostración insertadas')
    }

    const eventosExistentes = await database.collection('eventos').countDocuments()
    if (eventosExistentes === 0) {
      await database.collection('eventos').insertMany(datosDemostracion.eventos)
      console.log('Eventos de demostración insertados')
    }

    const miembrosExistentes = await database.collection('miembros').countDocuments()
    if (miembrosExistentes === 0) {
      await database.collection('miembros').insertMany(datosDemostracion.miembros)
      console.log('Miembros de demostración insertados')
    }
  } catch (error) {
    console.error('Error inicializando datos:', error)
  }
}

export async function GET(request) {
  try {
    const database = await connectDB()
    await inicializarDatos()
    
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/api/', '')
    
    switch (pathname) {
      case 'noticias':
        const noticias = await database.collection('noticias')
          .find({})
          .sort({ fecha: -1 })
          .toArray()
        return NextResponse.json({ noticias })
      
      case 'eventos':
        const eventos = await database.collection('eventos')
          .find({})
          .sort({ fecha: 1 })
          .toArray()
        return NextResponse.json({ eventos })
      
      case 'miembros':
        const miembros = await database.collection('miembros')
          .find({})
          .sort({ fechaIngreso: -1 })
          .toArray()
        return NextResponse.json({ miembros })
      
      default:
        return NextResponse.json({ 
          message: 'API de AIPMA funcionando correctamente',
          endpoints: ['/api/noticias', '/api/eventos', '/api/miembros', '/api/contacto']
        })
    }
  } catch (error) {
    console.error('Error en GET:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const database = await connectDB()
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/api/', '')
    const body = await request.json()
    
    switch (pathname) {
      case 'contacto':
        const mensaje = {
          id: uuidv4(),
          nombre: body.nombre,
          email: body.email,
          mensaje: body.mensaje,
          fecha: new Date(),
          leido: false
        }
        
        await database.collection('mensajes').insertOne(mensaje)
        return NextResponse.json({ 
          success: true, 
          message: 'Mensaje enviado exitosamente' 
        })
      
      case 'noticias':
        const nuevaNoticia = {
          id: uuidv4(),
          titulo: body.titulo,
          resumen: body.resumen,
          contenido: body.contenido,
          categoria: body.categoria,
          autor: body.autor,
          fecha: new Date(body.fecha || Date.now()),
          fechaCreacion: new Date()
        }
        
        await database.collection('noticias').insertOne(nuevaNoticia)
        return NextResponse.json({ 
          success: true, 
          noticia: nuevaNoticia 
        })
      
      case 'eventos':
        const nuevoEvento = {
          id: uuidv4(),
          titulo: body.titulo,
          descripcion: body.descripcion,
          fecha: new Date(body.fecha),
          ubicacion: body.ubicacion,
          tipo: body.tipo,
          capacidad: body.capacidad,
          fechaCreacion: new Date()
        }
        
        await database.collection('eventos').insertOne(nuevoEvento)
        return NextResponse.json({ 
          success: true, 
          evento: nuevoEvento 
        })
      
      case 'miembros':
        const nuevoMiembro = {
          id: uuidv4(),
          nombre: body.nombre,
          organizacion: body.organizacion,
          especialidad: body.especialidad,
          pais: body.pais,
          tipo: body.tipo,
          fechaIngreso: new Date(body.fechaIngreso || Date.now()),
          fechaCreacion: new Date()
        }
        
        await database.collection('miembros').insertOne(nuevoMiembro)
        return NextResponse.json({ 
          success: true, 
          miembro: nuevoMiembro 
        })
      
      default:
        return NextResponse.json(
          { error: 'Endpoint no encontrado' },
          { status: 404 }
        )
    }
  } catch (error) {
    console.error('Error en POST:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const database = await connectDB()
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/api/', '')
    const body = await request.json()
    const segments = pathname.split('/')
    const collection = segments[0]
    const id = segments[1]
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido para actualización' },
        { status: 400 }
      )
    }
    
    const updateData = {
      ...body,
      fechaActualizacion: new Date()
    }
    
    const result = await database.collection(collection).updateOne(
      { id: id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Elemento no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Elemento actualizado exitosamente' 
    })
  } catch (error) {
    console.error('Error en PUT:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const database = await connectDB()
    const url = new URL(request.url)
    const pathname = url.pathname.replace('/api/', '')
    const segments = pathname.split('/')
    const collection = segments[0]
    const id = segments[1]
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido para eliminación' },
        { status: 400 }
      )
    }
    
    const result = await database.collection(collection).deleteOne({ id: id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Elemento no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Elemento eliminado exitosamente' 
    })
  } catch (error) {
    console.error('Error en DELETE:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}