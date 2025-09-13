'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UsersIcon, NewspaperIcon, GlobalIcon, MailIcon, MenuIcon, XIcon } from 'lucide-react'

function AIPMAWebsite() {
  const [activeSection, setActiveSection] = useState('inicio')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [noticias, setNoticias] = useState([])
  const [eventos, setEventos] = useState([])
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [noticiasRes, eventosRes, miembrosRes] = await Promise.all([
        fetch('/api/noticias'),
        fetch('/api/eventos'),
        fetch('/api/miembros')
      ])
      
      const noticiasData = await noticiasRes.json()
      const eventosData = await eventosRes.json()
      const miembrosData = await miembrosRes.json()
      
      setNoticias(noticiasData.noticias || [])
      setEventos(eventosData.eventos || [])
      setMiembros(miembrosData.miembros || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const contactData = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      mensaje: formData.get('mensaje')
    }

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })
      
      if (response.ok) {
        alert('Mensaje enviado exitosamente')
        e.target.reset()
      } else {
        alert('Error al enviar el mensaje')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el mensaje')
    }
  }

  const navigation = [
    { id: 'inicio', label: 'Inicio', icon: GlobalIcon },
    { id: 'nosotros', label: 'Quiénes Somos', icon: UsersIcon },
    { id: 'noticias', label: 'Noticias', icon: NewspaperIcon },
    { id: 'eventos', label: 'Eventos', icon: CalendarIcon },
    { id: 'miembros', label: 'Miembros', icon: UsersIcon },
    { id: 'contacto', label: 'Contacto', icon: MailIcon }
  ]

  const renderHeader = () => (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <GlobalIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AIPMA</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Alianza Internacional de Periodismo</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => setActiveSection(item.id)}
                className="text-sm"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => {
                    setActiveSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )

  const renderInicio = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxnbG9iYWx8ZW58MHx8fHwxNzU3NzkxODQzfDA&ixlib=rb-4.1.0&q=85)'
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Conectando el Periodismo
            <span className="block text-primary">y los Medios en el Mundo</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La Alianza Internacional de Periodismo y Medios Audiovisuales representa la pluralidad, 
            ética y credibilidad de la voz global del periodismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setActiveSection('nosotros')}>
              Conoce Más Sobre Nosotros
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveSection('miembros')}>
              Únete a AIPMA
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Nuestros Pilares</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AIPMA se fundamenta en principios sólidos que guían nuestra misión global
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <GlobalIcon className="h-8 w-8" />
              </div>
              <CardTitle>Alcance Global</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Conectamos periodistas y medios de comunicación de todos los continentes, 
                promoviendo el intercambio de experiencias y mejores prácticas.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <NewspaperIcon className="h-8 w-8" />
              </div>
              <CardTitle>Ética Periodística</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Defendemos los más altos estándares éticos en el periodismo, 
                promoviendo la verdad, independencia y responsabilidad social.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8" />
              </div>
              <CardTitle>Comunidad Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fomentamos una red sólida de profesionales comprometidos con la excelencia 
                en el periodismo y los medios audiovisuales.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent News Preview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Últimas Noticias</h2>
            <p className="text-muted-foreground">Mantente al día con las novedades del mundo del periodismo</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.slice(0, 3).map((noticia) => (
              <Card key={noticia.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{noticia.categoria}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(noticia.fecha).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{noticia.titulo}</CardTitle>
                  <CardDescription>{noticia.resumen}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => setActiveSection('noticias')}>Ver Todas las Noticias</Button>
          </div>
        </div>
      </section>
    </div>
  )

  const renderNosotros = () => (
    <div className="space-y-16 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-6">Quiénes Somos</h1>
            <p className="text-xl text-muted-foreground">
              La voz global del periodismo profesional y ético
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-4">
                AIPMA nació de la necesidad de crear una red internacional que conectara 
                a los profesionales del periodismo y medios audiovisuales, promoviendo 
                estándares éticos y la excelencia profesional a nivel global.
              </p>
              <p className="text-muted-foreground">
                Desde nuestros inicios, hemos trabajado incansablemente para defender 
                la libertad de prensa, la independencia editorial y el derecho a la información.
              </p>
            </div>
            <div 
              className="bg-cover bg-center rounded-lg h-64"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1623039405147-547794f92e9e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXNtfGVufDB8fHx8MTc1Nzc5MTgzNHww&ixlib=rb-4.1.0&q=85)'
              }}
            />
          </div>

          <div className="bg-card p-8 rounded-lg border border-border mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Nuestra Misión</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Fortalecer el periodismo global mediante la promoción de la ética profesional, 
              el intercambio de conocimientos y la defensa de la libertad de expresión, 
              conectando a periodistas y medios audiovisuales de todo el mundo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Nuestros Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span>Ética y Transparencia</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span>Independencia Editorial</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span>Veracidad y Precisión</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span>Responsabilidad Social</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span>Diversidad y Pluralidad</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nuestro Impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Países Representados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Miembros Activos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div className="text-sm text-muted-foreground">Eventos Anuales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNoticias = () => (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Noticias y Publicaciones</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mantente informado sobre las últimas novedades del mundo del periodismo y medios audiovisuales
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando noticias...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {noticias.length > 0 ? (
              noticias.map((noticia) => (
                <Card key={noticia.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">{noticia.categoria}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(noticia.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{noticia.titulo}</CardTitle>
                    <CardDescription className="text-base">{noticia.resumen}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{noticia.contenido}</p>
                    {noticia.autor && (
                      <p className="text-sm text-muted-foreground">
                        Por: <span className="font-medium">{noticia.autor}</span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <NewspaperIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay noticias disponibles en este momento.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const renderEventos = () => (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Eventos y Conferencias</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Únete a nuestros eventos internacionales, seminarios y talleres para profesionales del periodismo
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando eventos...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={evento.tipo === 'conferencia' ? 'default' : 'secondary'}>
                        {evento.tipo}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{evento.ubicacion}</span>
                    </div>
                    <CardTitle className="text-xl">{evento.titulo}</CardTitle>
                    <CardDescription>
                      <CalendarIcon className="h-4 w-4 inline mr-2" />
                      {new Date(evento.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{evento.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {evento.capacidad} participantes máx.
                      </span>
                      <Button size="sm">Registrarse</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay eventos programados en este momento.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const renderMiembros = () => (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Miembros y Alianzas</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Únete a nuestra comunidad global de periodistas y profesionales de medios audiovisuales
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Beneficios de ser Miembro</CardTitle>
                <CardDescription>
                  Descubre todas las ventajas de formar parte de AIPMA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">Acceso a recursos exclusivos y bases de datos especializadas</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">Participación en eventos internacionales con descuentos especiales</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">Red global de contactos profesionales</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">Certificaciones y programas de formación continua</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">Oportunidades de colaboración internacional</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">Soporte legal y ético en temas profesionales</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full">Solicitar Membresía</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{miembros.length}</div>
                    <div className="text-sm text-muted-foreground">Miembros Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Países</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">25+</div>
                    <div className="text-sm text-muted-foreground">Organizaciones Aliadas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Directorio de Miembros</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando miembros...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {miembros.length > 0 ? (
                miembros.map((miembro) => (
                  <Card key={miembro.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{miembro.nombre}</CardTitle>
                        <Badge variant="outline">{miembro.tipo}</Badge>
                      </div>
                      <CardDescription>
                        {miembro.especialidad} • {miembro.pais}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{miembro.organizacion}</p>
                      <p className="text-sm text-muted-foreground">
                        Miembro desde: {new Date(miembro.fechaIngreso).getFullYear()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="text-center py-12">
                      <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">El directorio se está actualizando.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderContacto = () => (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contacto</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para apoyarte. Contáctanos para cualquier consulta o para unirte a nuestra comunidad
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo pronto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nombre Completo
                    </label>
                    <Input 
                      name="nombre" 
                      required 
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Correo Electrónico
                    </label>
                    <Input 
                      name="email" 
                      type="email" 
                      required 
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Mensaje
                    </label>
                    <Textarea 
                      name="mensaje" 
                      required 
                      rows={5}
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MailIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Correo Electrónico</p>
                    <p className="text-muted-foreground">contacto@aipma.org</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <GlobalIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Sitio Web</p>
                    <p className="text-muted-foreground">www.aipma.org</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <UsersIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Redes Sociales</p>
                    <p className="text-muted-foreground">@AIPMA_Oficial</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Únete a Nuestro Newsletter</CardTitle>
                <CardDescription>
                  Recibe las últimas noticias y actualizaciones del mundo del periodismo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input placeholder="tu@email.com" className="flex-1" />
                  <Button>Suscribirse</Button>
                </div>
              </CardContent>
            </Card>

            <div 
              className="bg-cover bg-center rounded-lg h-48"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1497015289639-54688650d173?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxtZWRpYXxlbnwwfHx8fDE3NTc3OTE4Mzh8MA&ixlib=rb-4.1.0&q=85)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'nosotros':
        return renderNosotros()
      case 'noticias':
        return renderNoticias()
      case 'eventos':
        return renderEventos()
      case 'miembros':
        return renderMiembros()
      case 'contacto':
        return renderContacto()
      default:
        return renderInicio()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      <main>
        {renderContent()}
      </main>
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <GlobalIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">AIPMA</h3>
                <p className="text-xs text-muted-foreground">Alianza Internacional de Periodismo y Medios Audiovisuales</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 AIPMA. Conectando el periodismo y los medios en el mundo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

