import { Paginated } from '../../../../main/shared/paginated';
import { PaymentsViewModel } from './payments-view.dto';

export class PaymentsWithPaginationViewDto extends Paginated<PaymentsViewModel> {
  items: PaymentsViewModel;
}
