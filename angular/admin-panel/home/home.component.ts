import { ListService, PagedResultDto } from '@abp/ng.core';
import { ConfirmationService,Confirmation } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentDto, StudentService } from '@proxy/students';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
})
export class HomeComponent implements OnInit
{
  student = { items: [], totalCount: 0 } as PagedResultDto<StudentDto>;
  form: FormGroup;
  selectedStudent = {} as StudentDto;
  isModalOpen = false;
  
  
  constructor(
    public readonly list: ListService,
    private studentService: StudentService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit() {
    const studentStreamCreator = (query) => this.studentService.getList(query);

    this.list.hookToQuery(studentStreamCreator).subscribe((response) => {
      this.student = response;
    });
    
  }

  createStudent()
  {
    this.selectedStudent = {} as StudentDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editStudent(id: string) {
    this.studentService.get(id).subscribe((student) => {
      this.selectedStudent = student;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedStudent.name || null, Validators.required],
      schoolNumber: [this.selectedStudent.schoolNumber || null, Validators.required],
      registrationDate: [
        this.selectedStudent.registrationDate ? new Date(this.selectedStudent.registrationDate) : null,
        Validators.required,
      ],
      totalCourse: [this.selectedStudent.totalCourse || null, Validators.required],
      totalCredit: [this.selectedStudent.totalCredit || null, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedStudent.id ? this.studentService.update(this.selectedStudent.id, this.form.value) : this.studentService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  deleteStudent(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', 'AbpAccount::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.studentService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

}
