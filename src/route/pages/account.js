import { authConfirm } from '../../auth/authAPI';
import { toast } from '../../utils/useful';
import { modalSignIn } from '../../auth/Modal-form';
import { modalGenerate } from '../../utils/useful';
import { accountMain } from '../../account/account-form';

function Account($selector) {
	this.$selector = $selector;
	this.setState = () => {
		this.render();
	};

	this.render = () => {
		this.$selector.innerHTML = ``;
		accountMain();
		if (!localStorage.accessToken) {
			this.$selector.innerHTML = ``;
			toast('로그인이 필요합니다.');
			modalSignIn(modalGenerate());
		}
	};
	this.render();
}

export default Account;
