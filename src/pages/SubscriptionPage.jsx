import { Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const SubscriptionPage = () => {
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      description: 'Para comenzar',
      features: [
        'Hasta 5 objetivos personales',
        '1 objetivo grupal',
        'Historial de transacciones limitado',
        'Soporte por email'
      ],
      current: true,
      cta: 'Plan Actual'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      description: 'Para usuarios activos',
      features: [
        'Objetivos personales ilimitados',
        'Objetivos grupales ilimitados',
        'Historial de transacciones completo',
        'Análisis financiero avanzado',
        'Sincronización con apps bancarias',
        'Soporte prioritario',
        'Reportes personalizados'
      ],
      current: false,
      cta: 'Suscribirse'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      description: 'Máximo potencial',
      features: [
        'Todo en Pro',
        'Asesoramiento financiero semanal',
        'Acceso a webinars exclusivos',
        'Herramientas de inversión',
        'Seguimiento de activos',
        'API para terceros',
        'Soporte 24/7',
        'Eliminar anuncios'
      ],
      current: false,
      cta: 'Suscribirse Now'
    }
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Planes de Suscripción
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Elige el plan que mejor se adapte a tus necesidades financieras
        </p>
      </div>

      {/* Current Plan Info */}
      {/* <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Plan Actual: Gratuito
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Actualiza tu plan para desbloquear más funciones
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col transition-all ${
              plan.current
                ? 'ring-2 ring-emerald-500 transform scale-105 shadow-xl'
                : 'hover:shadow-lg'
            }`}
          >
            {plan.current && (
              <div className="bg-emerald-500 text-white text-center py-2 text-sm font-semibold">
                Plan Actual ✓
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                  /mes
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full ${
                  plan.current
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                disabled={plan.current}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {[
            {
              q: '¿Puedo cambiar de plan en cualquier momento?',
              a: 'Sí, puedes cambiar de plan en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.'
            },
            {
              q: '¿Hay período de prueba gratuito?',
              a: 'El plan Gratuito es siempre sin costo. El plan Pro incluye 7 días de prueba gratis.'
            },
            {
              q: '¿Cómo cancelo mi suscripción?',
              a: 'Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta.'
            }
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;