import { trigger, animate, transition, query, style, animateChild, group, state } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  // transition('* <=> *', [
  //   group([
  //     // Enterder
  //     query(':enter', [
  //       style({ opacity: 0 }),
  //       animate('0.8s', style({ opacity: 1 })),
  //       animateChild()
  //     ], { optional: true }),
  //     // Leave
  //     query(':leave', [
  //       style({ opacity: 1 }),
  //       animate('0.8s', style({ opacity: 0 })),
  //       animateChild()
  //     ], { optional: true }),
  //   ])
  // ])
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('0.5s', style({ opacity: 0 })),
  ])
]);
export const fadeStateAnimation = trigger('fadeStateAnimation', [
  // state('out', style({ opacity: 1 })),
  // state('in', style({ transform: 'translateY(-50px)' })),
  // state('edit', query('', style({ color: 'blue '}))),
  transition('void <=> out', [
    style({ opacity: 1 }),
    animate('0.4s ease-in', style({ transform: 'translateY(-50px)', opacity: 0, backgroundColor: 'red' })),
  ]),
  transition('void <=> in', [
    style({ transform: 'translateY(-50px)', backgroundColor: 'aquamarine', opacity: 0 }),
    animate('0.4s ease-out', style({ transform: 'translateY(0)', opacity: 1, backgroundColor: 'aquamarine' })),
    animate('1s ease-out'),
  ]),
  transition('* <=> edit', [
    animate('2s', style({ backgroundColor: 'blue' }))
  ])

]);
